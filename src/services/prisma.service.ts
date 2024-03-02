import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaServie extends PrismaClient implements OnModuleInit {
  [x: string]: any
  async onModuleInit() {
    await this.$connect()
  }
}
