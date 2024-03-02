import { IsDate, IsDateString, IsEmail, IsEmpty, IsNotEmpty } from 'class-validator'
import mongoose from 'mongoose'
import { MESSAGES_RESPONSE } from 'src/constants/messages'

export class CreateUserDto {}

export class RegisterCustomer {
  @IsEmail({}, { message: MESSAGES_RESPONSE.INVALID_EMAIL })
  @IsNotEmpty({ message: MESSAGES_RESPONSE.EMAIL_IS_REQUIRED })
  email: string

  @IsNotEmpty({ message: MESSAGES_RESPONSE.NAME_IS_REQUIRED })
  name: string

  @IsNotEmpty({ message: MESSAGES_RESPONSE.PASSWORD_IS_REQUIRED })
  password: string

  @IsNotEmpty({ message: MESSAGES_RESPONSE.PHONE_IS_REQUIRED })
  phone: string

  @IsNotEmpty({ message: MESSAGES_RESPONSE.GENDER_IS_REQUIRED })
  gender: string

  @IsDateString({}, { message: MESSAGES_RESPONSE.DATE_OF_BIRTH_IS_INVALID })
  dateOfBirth: Date
}

export class RegisterAgency {
  @IsNotEmpty({ message: MESSAGES_RESPONSE.PICKUP_ADDRESS_IS_REQUIRED })
  pickup_address: string
  @IsNotEmpty({ message: MESSAGES_RESPONSE.SHOP_NAME_IS_REQUIRED })
  shop_name: string
  @IsNotEmpty({ message: MESSAGES_RESPONSE.TAX_CODE_IS_REQUIRED })
  tax_code: string
  @IsNotEmpty({ message: MESSAGES_RESPONSE.CITIZEN_ID_IS_REQUIRED })
  citizen_id: string
  @IsNotEmpty({ message: MESSAGES_RESPONSE.ID_USERS_IS_REQUIRED })
  id_users: mongoose.Schema.Types.ObjectId
}
