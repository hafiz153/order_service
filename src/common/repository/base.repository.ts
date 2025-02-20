import { Query } from '@nestjs/common';
import { PaginationFilterDto } from './../dto/paginate.dto';
import { Model } from 'mongoose';

export class BaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const res= await this.model.create(data);
    console.log({res})
    return res
  }

  async findOne(
    filter: object,
    projection?: object,
    populate?: string | string[],
  ): Promise<T | null> {
    let query = this.model.findOne(filter, projection);
  
    if (populate) {
      query = query.populate(populate);
    }
  
    return await query.exec();
  }
  async findOneAndUpdate(filter: object, update: object, options = { new: true }): Promise<T | null> {
    return await this.model.findOneAndUpdate(filter, update, options);
  }

  async remove(filter: object): Promise<T | null> {
    return await this.model.findOneAndDelete(filter);
  }

  async paginate(
    @Query() query: PaginationFilterDto,
    projection?: Record<string, number>
  ): Promise<{ 
    total: number; 
    totalPages: number; 
    nextPage: number | null; 
    pageNumber: number; 
    items: T[]; 
  }> {
    console.log({ query });
  
    // Extract pagination parameters
    const { page = 1, limit = 10, sort } = query;
  
    // Extract filter parameters dynamically
    const filter: any = Object.fromEntries(
      Object.entries(query).filter(([key]) => !['page', 'limit', 'sort'].includes(key))
    );
  
    console.log(filter);
  
    // Get total document count
    const total = await this.model.countDocuments(filter);
  
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
  
    // Calculate next page (null if last page)
    const nextPage = page < totalPages ? page + 1 : null;
  
    // Fetch paginated results with projection
    const data = await this.model
      .find(filter, projection) // Apply projection here
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit).lean();

      const items:any = data.map(({ _id, __v, ...rest }) => ({
        id: _id,  // Rename _id to id
        ...rest,  // Spread remaining properties
      }));
  
    return {
      total,
      totalPages,
      nextPage,
      pageNumber: page,
      items,
    };
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
