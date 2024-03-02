import { PartialType } from '@nestjs/mapped-types'
import { IsBoolean, IsBooleanString, IsNumberString, IsOptional, IsString } from 'class-validator'

export class IQueryParamsFilter {
  @IsNumberString({}, { message: 'Skip must be a number' })
  @IsOptional()
  skip?: number
  @IsNumberString({}, { message: 'Limit must be a number' })
  @IsOptional()
  limit?: number
  @IsNumberString({}, { message: 'Page must be a number' })
  @IsOptional()
  page?: number
  @IsString({ message: 'Sort must be a string' })
  @IsOptional()
  sort?: string
  @IsString({ message: 'Filter must be a string' })
  @IsOptional()
  filter?: string
  @IsString({ message: 'Projection must be a string' })
  @IsOptional()
  projection?: string
  @IsString({ message: 'Population must be a string' })
  @IsOptional()
  population?: string
}

export class IQueryParamsUser extends PartialType(IQueryParamsFilter) {
  @IsBooleanString({ message: 'Is agency must be a boolean' })
  @IsOptional()
  agency?: string
  @IsBooleanString({ message: 'Is customer must be a boolean' })
  @IsOptional()
  customer?: string
}

export interface PopulateOptionss {
  Agency?: boolean
  Customer?: boolean
  Notification?: boolean
  Rating?: boolean
  Cart?: boolean
  Order?: boolean
  Image?: boolean
  _count?: boolean
}
