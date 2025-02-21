import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Determine status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Get message from exception
    const exceptionResponse = exception.getResponse
      ? exception.getResponse()
      : exception.message;
    const message =
      typeof exceptionResponse === 'object'
        ? exceptionResponse?.message
        : exception.message;

    // Ensure message is always an array for consistency
    const responseObjArr = Array.isArray(message) ? message : [message];

    // Log error details
    this.logger.error(
      `Error in ${request.method} ${request.url}`,
      exception.stack,
    );

    // Send response
    response.status(status).json({
      success: false,
      statusCode: status,
      message: responseObjArr,
      data: null,
    });
  }
}
