import { IsDateString, IsEmail, IsEmpty, IsNotEmpty, IsOptional } from 'class-validator'
import { MESSAGES_RESPONSE } from 'src/constants/messages'

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: MESSAGES_RESPONSE.INVALID_EMAIL })
  @IsNotEmpty({ message: MESSAGES_RESPONSE.EMAIL_IS_REQUIRED })
  email: string
  @IsOptional()
  @IsNotEmpty({ message: MESSAGES_RESPONSE.NAME_IS_REQUIRED })
  name: string
  @IsOptional()
  @IsNotEmpty({ message: MESSAGES_RESPONSE.PASSWORD_IS_REQUIRED })
  password: string
  @IsOptional()
  @IsNotEmpty({ message: MESSAGES_RESPONSE.PHONE_IS_REQUIRED })
  phone: string
  @IsOptional()
  @IsNotEmpty({ message: MESSAGES_RESPONSE.GENDER_IS_REQUIRED })
  gender: string
  @IsOptional()
  @IsDateString({}, { message: MESSAGES_RESPONSE.DATE_OF_BIRTH_IS_INVALID })
  dateOfBirth: Date
}

export class UpdateAgencyDto {
  @IsOptional()
  @IsNotEmpty({ message: MESSAGES_RESPONSE.SHOP_NAME_IS_REQUIRED })
  shopName: string[]
  @IsOptional()
  @IsNotEmpty({ message: MESSAGES_RESPONSE.PICKUP_ADDRESS_IS_REQUIRED })
  taxCode: string
  @IsOptional()
  @IsNotEmpty({ message: MESSAGES_RESPONSE.PICKUP_ADDRESS_IS_REQUIRED })
  citizenId: string
}
