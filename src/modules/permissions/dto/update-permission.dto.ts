import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdatePermissionDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string
  @IsOptional()
  @IsString({ message: 'Path must be a string' })
  @IsNotEmpty({ message: 'Path is required' })
  path: string
  @IsOptional()
  @IsString({ message: 'Method must be a string' })
  @IsNotEmpty({ message: 'Method is required' })
  method: string
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description: string
}
