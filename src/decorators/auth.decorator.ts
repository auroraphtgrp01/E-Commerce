import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

export const IS_SKIP_PERMISSION = 'isSkipPerMission'
export const SkipPermission = () => SetMetadata(IS_SKIP_PERMISSION, true)
