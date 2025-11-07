import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Request');

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const userId = req.headers['x-user-id'] || 'anonymous';
    this.logger.log(`Incoming ${req.method} ${req.url} from user ${userId}`);
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.logger.log(`Completed ${req.method} ${req.url} in ${duration}ms`);
      }),
    );
  }
}