import { PrismaClient } from '@prisma/client'
import { createSoftDeleteExtension } from 'prisma-extension-soft-delete'

export const extendedPrismaClient = new PrismaClient().$extends(
  createSoftDeleteExtension({
    models: {
      User: true,
      Customer: true,
      Agency: true,
      Address: true,
      Cart: true,
      CartItem: true,
      Category: true,
      Delivery: true,
      DeliveryDetail: true,
      Image: true,
      Notification: true,
      Order: true,
      PaymentCard: true,
      Permission: true,
      Product: true,
      Rating: true,
      Role: true,
      Variant: true
    },
    defaultConfig: {
      field: 'deletedAt',
      createValue: (deleted) => {
        if (deleted) return new Date()
        return null
      }
    }
  })
)

export type ExtendedPrismaClient = typeof extendedPrismaClient
