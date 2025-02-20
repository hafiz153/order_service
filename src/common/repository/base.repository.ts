import { PaginationFilterDto } from './../dto/paginate.dto';
import { Model } from 'mongoose';

export class BaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const res= await this.model.create(data);
    console.log({res})
    return res
  }

  async findOne(filter: object, projection?: object): Promise<T | null> {
    return await this.model.findOne(filter, projection);
  }

  async findOneAndUpdate(filter: object, update: object, options = { new: true }): Promise<T | null> {
    return await this.model.findOneAndUpdate(filter, update, options);
  }

  async remove(filter: object): Promise<T | null> {
    return await this.model.findOneAndDelete(filter);
  }

  async paginate(body:PaginationFilterDto): Promise<T[]> {
    const {filter, page=1, limit=20, sort } = body;
    return await this.model.find(filter).sort(sort).skip((page - 1) * limit).limit(limit);
  }

  async countDocuments(filter: object): Promise<number> {
    return await this.model.countDocuments(filter);
  }

//   async bulkInsert(data: Partial<T>[]): Promise<T[]> {
//     return await this.model.insertMany(data);
//   }

  async bulkUpdate(filter: object, update: object): Promise<any> {
    return await this.model.updateMany(filter, update);
  }

  async softDelete(filter: object): Promise<T | null> {
    return await this.model.findOneAndUpdate(filter, { deletedAt: new Date() }, { new: true });
  }

  async restore(filter: object): Promise<T | null> {
    return await this.model.findOneAndUpdate(filter, { deletedAt: null }, { new: true });
  }

  async findWithRelations(filter: object, populateFields: string[]): Promise<T[]> {
    return await this.model.find(filter).populate(populateFields);
  }
}
