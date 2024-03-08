import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    name: string
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description: string
    @IsOptional()
    @IsArray({ message: 'Permissions must be an array' })
    @IsString({ each: true, message: 'Each permission must be a string' })
    permissions: string[]
}
