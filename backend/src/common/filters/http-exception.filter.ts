
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        console.error('------------------------------------------------');
        console.error('CRITICAL ERROR CAUGHT BY FILTER:');
        if (exception instanceof Error) {
            console.error('Message:', exception.message);
            console.error('Stack:', exception.stack);
        } else {
            console.error(exception);
        }
        console.error('------------------------------------------------');

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: (exception instanceof Error) ? exception.message : 'Internal server error',
        });
    }
}
