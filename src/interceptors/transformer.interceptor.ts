import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { Reflector } from "@nestjs/core";
import { Observable, map } from "rxjs";
import { RESPONSE_MESSAGE } from "src/decorators/customize.decorator";

export interface Response {
    statusCode: number;
    message: string;
    data: any;
    meta: object
}

@Injectable()
export class TransformIntercepter<T> implements NestInterceptor<T, Response> {
    constructor(private readonly reflector: Reflector) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response> {
        return next.handle().pipe(
            map((data) => ({
                statusCode: context.switchToHttp().getResponse().statusCode,
                message: this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) || 'API RESPONSE',
                data: {
                    result: data?.result || data,
                },
                meta: data?.meta || {}
            }))
        )
    }
}