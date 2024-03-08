import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { Reflector } from "@nestjs/core";
import { Observable, map } from "rxjs";
import { RESPONSE_MESSAGE } from "src/decorators/customize.decorator";
import { filterObject } from "src/utils/filterNestedObject";
export interface Response {
    statusCode: number;
    message: string;
    data: any;
    meta: object
}

const keysToRemove = ["createdAt", "updatedAt", "deletedAt", 'updatedBy', 'createdBy', 'password', 'deletedBy']
@Injectable()
export class TransformIntercepter<T> implements NestInterceptor<T, Response> {
    constructor(private readonly reflector: Reflector) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response> {
        return next.handle().pipe(
            map((data) => ({
                statusCode: context.switchToHttp().getResponse().statusCode,
                message: this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) || 'API RESPONSE',
                data: {
                    result: filterObject(data, keysToRemove),
                },
                meta: data?.meta || {}
            }))
        )
    }
}

