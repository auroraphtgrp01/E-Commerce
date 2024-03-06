import { ExecutionContext, SetMetadata, createParamDecorator } from "@nestjs/common"

export const RESPONSE_MESSAGE = 'responseMessage'
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE, message)

export const UserInfo = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return data ? request.user[data] : request.user
})