import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/api-response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data: any) => {
        const statusCode = (response.statusCode as number | undefined) || HttpStatus.OK;
        const message = (data?.message as string | undefined) || 'Request successful';
        const responseData = (data?.data as T | undefined) ?? data;
        const meta = (data?.meta as any) ?? null;

        return new ApiResponse<T>(
          true,
          statusCode,
          message,
          responseData,
          meta,
        );
      }),
    );
  }
}
