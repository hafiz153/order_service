import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        errorCode: 200,
        data: this.transformResponse(data),
      })),
      catchError((err) => {
        console.error('🚨 Error in Interceptor:', err);

        let errorCode = err.status || 500;
        let message = err?.message || 'Internal Server Error';
        let errors = null;

        if (err instanceof HttpException) {
          const response = err.getResponse() as any;
          errorCode = err.getStatus();
          message = response.message || err.message;

          // ✅ Handle Validation Errors
          if (
            err instanceof BadRequestException &&
            Array.isArray(response.message)
          ) {
            errors = response.message.map((error) => ({
              field: error.property,
              constraints: error.constraints,
            }));
          }
        }

        return throwError(() => ({
          success: false,
          errorCode,
          message,
          errors,
          data: null,
        }));
      }),
    );
  }

  private transformResponse(data: any): any {
    if (!data) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.formatObject(item));
    } else if (typeof data === 'object') {
      return this.formatObject(data);
    }
    return data;
  }

  private formatObject(obj: any): any {
    if (obj && typeof obj.toObject === 'function') {
      obj = obj.toObject(); // Convert Mongoose object to plain JavaScript object
    }

    const { _id, __v, ...rest } = obj;
    return { id: _id, ...rest }; // Rename `_id` to `id`
  }
}
