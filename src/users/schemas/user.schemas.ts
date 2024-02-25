import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, mongo } from 'mongoose'

export type UserDocument = HydratedDocument<User>

export type CustomerDocument = HydratedDocument<Customer>

export type AgencyDocument = HydratedDocument<Agency>

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop()
  name: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop()
  password: string

  @Prop()
  phone: string

  @Prop()
  gender: string

  @Prop()
  date_of_birth: Date

  @Prop()
  id_image: mongoose.Schema.Types.ObjectId

  @Prop()
  refresh_token: string

  @Prop()
  roles: string

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date

  @Prop()
  createdBy: mongoose.Schema.Types.ObjectId

  @Prop()
  updatedBy: mongoose.Schema.Types.ObjectId

  @Prop()
  isDeleted: boolean

  @Prop()
  deletedBy: mongoose.Schema.Types.ObjectId
}

@Schema({ timestamps: true, collection: 'customers' })
export class Customer {
  @Prop({ required: true, unique: true })
  id_users: mongoose.Schema.Types.ObjectId

  @Prop()
  payment_card: string[]

  @Prop()
  address: string[]

  @Prop()
  updated_at: Date

  @Prop()
  created_at: Date

  @Prop()
  deletedAt: Date

  @Prop()
  isDeleted: boolean

  @Prop({ type: Object })
  createdBy: {
    _id: string
    email: string
  }

  @Prop({ type: Object })
  updatedBy: {
    _id: string
    email: string
  }

  @Prop({ type: Object })
  deletedBy: {
    _id: string
    email: string
  }
}

@Schema({ timestamps: true, collection: 'agencies' })
export class Agency {
  @Prop()
  pickup_address: string

  @Prop()
  payment_card: string[]

  @Prop()
  shop_name: string

  @Prop()
  tax_code: string

  @Prop()
  citizen_id: string

  @Prop({ required: true, unique: true })
  id_users: string

  @Prop()
  updated_at: Date

  @Prop()
  created_at: Date

  @Prop()
  deletedAt: Date

  @Prop()
  isDeleted: boolean

  @Prop({ type: Object })
  createdBy: {
    _id: string
    email: string
  }

  @Prop({ type: Object })
  updatedBy: {
    _id: string
    email: string
  }

  @Prop({ type: Object })
  deletedBy: {
    _id: string
    email: string
  }
}
export const UserSchema = SchemaFactory.createForClass(User)

export const CustomerSchema = SchemaFactory.createForClass(Customer)

export const AgencySchema = SchemaFactory.createForClass(Agency)
