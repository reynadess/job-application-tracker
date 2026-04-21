import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();

        let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            // Handles all NestJS HTTP exceptions
            httpStatus = exception.getStatus();
            const response = exception.getResponse();
            message =
                typeof response === 'string'
                    ? response
                    : ((response as any).message ?? exception.message);
        } else if (exception instanceof QueryFailedError) {
            // Handles TypeORM DB errors
            message = this.getQueryErrorMessage(exception);
            this.logger.error(
                `QueryFailedError: ${JSON.stringify(exception, null, 2)}`,
            );
        } else if (exception instanceof Error) {
            // Handles all other JS/Node errors
            message = exception.message;
            this.logger.error(
                `Unhandled Error: ${JSON.stringify(exception, null, 2)}`,
            );
        }

        const responseBody = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
            message,
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }

    private getQueryErrorMessage(exception: QueryFailedError): string {
        const code = (exception as any).driverError?.code;
        switch (code) {
            case '22007':
                return 'Invalid date/time format provided';
            case '23505':
                return 'Duplicate entry — record already exists';
            case '23503':
                return 'Foreign key constraint violation';
            case '23502':
                return 'Not null constraint violation';
            default:
                return 'A database error occurred';
        }
    }
}
