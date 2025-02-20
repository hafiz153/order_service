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
	const logger = new Logger('Error Logger');
	const ctx = host.switchToHttp();
	const request = ctx.getResponse();

	const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
	const message = exception?.response?.message || exception.message;
	let responseObjArr: unknown[];

	logger.error(exception.message, exception.stack, ctx.getRequest().url);

	if (typeof message === 'object') {
		responseObjArr = [...message];
	} else {
		responseObjArr = [message];
	}

	request.status(status).send({
		success: false,
		message: responseObjArr,
		data: null,
	});
}
}
