import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    BadRequestException,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      let status = 500;
      let message = 'Internal Server Error';
      let errorCode = 500;
      let errors = null;
  
      if (exception instanceof HttpException) {
        const res = exception.getResponse() as any;
        status = exception.getStatus();
        message = res.message || exception.message;
        errorCode = status;
  
        // ✅ Handle Validation Errors
        if (
          exception instanceof BadRequestException &&
          Array.isArray(res.message)
        ) {
          errors = res.message.map((error) => ({
            field: error.property,
            constraints: error.constraints,
          }));
        }
      }
  
      console.error('🚨 Exception Caught:', {
        errorCode,
        message,
        errors,
      });
  
      response.status(status).json({
        success: false,
        errorCode,
        message,
        errors,
        data: null,
      });
    }
  }
  