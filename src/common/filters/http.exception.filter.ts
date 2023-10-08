import { Logger } from '@nestjs/common';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const errorReq = {
      body: req.body,
      query: req.query,
      params: req.params,
    };
    this.logger.error(
      `${req.method} ${req.url} ${JSON.stringify(errorReq, null, 2)}`,
    );
    this.logger.error(exception.stack);

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const response = {
      statusCode: (exception as HttpException).getStatus(),
      message: (exception as HttpException).message,
      timestamp: new Date().toISOString(),
      path: req.url,
    };

    res.status((exception as HttpException).getStatus()).json(response);
  }
}
