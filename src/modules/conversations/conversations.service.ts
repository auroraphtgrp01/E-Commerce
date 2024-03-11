import { Inject, Injectable } from '@nestjs/common'
import { CreateConversationDto } from './dto/create-conversation.dto'
import { UpdateConversationDto } from './dto/update-conversation.dto'
import { CustomPrismaService } from 'nestjs-prisma'
import { ExtendedPrismaClient } from 'src/services/prisma_customize.service'
import { RoleConversation } from '@prisma/client'

@Injectable()
export class ConversationsService {
  constructor(@Inject('PrismaService') private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>) { }
  async create(user1, user2) {
    const chat = await this.prismaService.client.conversation.findMany({
      where: {
        User: {
          every: {
            OR: [
              {
                id: user1
              },
              {
                id: user2
              }
            ]
          }
        }
      },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true
              }
            },
            recipient: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    return chat
  }

  findAll() {
    return `This action returns all conversations`
  }

  findOne(id: number) {
    return `This action returns a #${id} conversation`
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`
  }
  async insertConversation(senderId: string, recipientId: string, role: RoleConversation, message: string) {
    let conversationId = null
    const conversation = await this.prismaService.client.conversation.findFirst({
      where: {
        User: {
          every: {
            OR: [
              {
                id: senderId
              },
              {
                id: recipientId
              }
            ]
          }
        }
      }
    })
    if (conversation === null) {
      conversationId = (await this.prismaService.client.conversation.create({
        data: {
          User: {
            connect: [
              {
                id: senderId
              },
              {
                id: recipientId
              }
            ]
          }
        }
      })).id
    } else {
      conversationId = conversation.id
    }
    await this.prismaService.client.message.create({
      data: {
        text: message,
        sender: {
          connect: {
            id: senderId
          }
        },
        recipient: {
          connect: {
            id: recipientId
          }
        },
        conversation: {
          connect: {
            id: conversationId
          }
        },
        role: role
      }
    })
  }
}
