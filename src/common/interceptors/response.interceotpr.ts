import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { map, Observable } from "rxjs";
import { Response as ExpressResponse } from 'express';
export class Response<T> {
	@ApiProperty()
	success: boolean;
	data: T;
}

@Injectable()
export class GlobalResponseTransformer<T> implements NestInterceptor<T, Response<T>> {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const httpContext = context.switchToHttp();
		const response = httpContext.getResponse<ExpressResponse>();
		return next.handle().pipe(
		  map((data) => ({
			success: true,
			statusCode: response.statusCode, // Dynamically fetch the HTTP status code
			data: this.transformData(data),
			message: null,
		  })),
		);
	  }

	private transformData(data: any): any {
		if (Array.isArray(data)) {
			return data.map(this.transformObject);
		} else if (typeof data === 'object' && data !== null) {
			return this.transformObject(data);
		}
		return data;
	}

	private transformObject(obj: any): any {
		if (!obj || typeof obj !== 'object') return obj;
		
		// If object has a `_doc` field, extract it (Mongoose document)
		const rawData = obj._doc ? obj._doc : obj;

		// Destructure fields to remove unwanted properties
		const { _id, __v, $__ , $isNew, ...rest } = rawData;

		// Rename `_id` to `id`
		return { id: _id ?? obj.id, ...rest };
	}
}

