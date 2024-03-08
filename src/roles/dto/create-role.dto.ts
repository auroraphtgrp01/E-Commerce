import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateRoleDto {
    @IsNotEmpty({ message: 'Name is required' })
    name: string
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description: string
    @IsString({ each: true, message: 'Each permission must be a string' })
    @IsArray({ message: 'Permissions must be an array' })
    permissions: string[]
}
