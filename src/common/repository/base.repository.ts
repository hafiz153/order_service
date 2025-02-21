import {
  InternalServerErrorException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { PaginationFilterDto } from './../dto/paginate.dto';
import { Model } from 'mongoose';

export class BaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data).catch((error) => {
      throw new InternalServerErrorException(
        `Error creating record: ${error.message}`,
      );
    });
  }
  async insertMany(data: Partial<T>[]): Promise<T[]> {
    try {
      const result = await this.model.insertMany(data, { ordered: false });
      return result as T[];
    } catch (error) {
      throw new InternalServerErrorException(
        `Error inserting documents: ${error.message}`,
      );
    }
  }
  async find(
    filter: object,
    projection?: object,
    populate?: string | string[],
  ): Promise<T[]> {
    let query = this.model.find(filter, projection);
    if (populate) {
      query = query.populate(populate);
    }

    return query.exec().then((result) => {
      if (!result) {
        throw new NotFoundException(
          `Record not found with filter: ${JSON.stringify(filter)}`,
        );
      }
      return result;
    });
  }
  async paginate(
    @Query() query: PaginationFilterDto,
    projection?: Record<string, number>,
  ): Promise<{
    total: number;
    totalPages: number;
    nextPage: number | null;
    pageNumber: number;
    items: T[];
  }> {
    const { page = 1, limit = 10, sort } = query;

    const filter: any = Object.fromEntries(
      Object.entries(query).filter(
        ([key]) => !['page', 'limit', 'sort'].includes(key),
      ),
    );

    return this.model.countDocuments(filter).then((total) => {
      const totalPages = Math.ceil(total / limit);
      const nextPage = page < totalPages ? page + 1 : null;

      return this.model
        .find(filter, projection)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .then((data) => {
          const items: any = data.map(({ _id, __v, ...rest }) => ({
            id: _id,
            ...rest,
          }));

          return {
            total,
            totalPages,
            nextPage,
            pageNumber: page,
            items,
          };
        });
    });
  }
  async findOne(
    filter: object,
    projection?: object,
    populate?: string | string[],
  ): Promise<T> {
    let query = this.model.findOne(filter, projection);
    if (populate) {
      query = query.populate(populate);
    }

    return query.exec().then((result) => {
      if (!result) {
        throw new NotFoundException(
          `Record not found with filter: ${JSON.stringify(filter)}`,
        );
      }
      return result;
    });
  }
  // Not through error
  async isExists(filter: object): Promise<T> {
    const doc = (await this.model.findOne(filter).lean()) as T;
    return doc;
  }
  async findOneAndUpdate(
    filter: object,
    update: object,
    options = { new: true },
  ): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filter, update, options)
      .then((result) => {
        if (!result) {
          throw new NotFoundException(
            `Record not found for update: ${JSON.stringify(filter)}`,
          );
        }
        return result;
      });
  }
  async bulkUpdate(filter: object, update: object): Promise<any> {
    return this.model.updateMany(filter, update);
  }
  async remove(filter: object): Promise<T | null> {
    return this.model.findOneAndDelete(filter).then((result) => {
      if (!result) {
        throw new NotFoundException(
          `Record not found for deletion: ${JSON.stringify(filter)}`,
        );
      }
      return result;
    });
  }
  async countDocuments(filter: object): Promise<number> {
    return this.model.countDocuments(filter);
  }
  async softDelete(filter: object): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filter, { deletedAt: new Date() }, { new: true })
      .then((result) => {
        if (!result) {
          throw new NotFoundException(
            `Record not found for soft delete: ${JSON.stringify(filter)}`,
          );
        }
        return result;
      });
  }
  async restore(filter: object): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filter, { deletedAt: null }, { new: true })
      .then((result) => {
        if (!result) {
          throw new NotFoundException(
            `Record not found for restore: ${JSON.stringify(filter)}`,
          );
        }
        return result;
      });
  }
  async findWithRelations(
    filter: object,
    populateFields: string[],
  ): Promise<T[]> {
    return this.model.find(filter).populate(populateFields);
  }
}
