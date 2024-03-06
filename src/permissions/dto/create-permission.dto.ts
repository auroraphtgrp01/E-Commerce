import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreatePermissionDto {
    @IsNotEmpty({ message: 'Name is required' })
    name: string
    @IsNotEmpty({ message: 'Path is required' })
    path: string
    @IsNotEmpty({ message: 'Method is required' })
    method: string
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description: string
}
