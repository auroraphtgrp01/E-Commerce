import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { AuthService } from './auth/auth.service'
import { UsersService } from './modules/users/users.service'
import { ConversationsService } from './modules/conversations/conversations.service'

@WebSocketGateway()
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
        private readonly conversationService: ConversationsService
    ) { }
    afterInit(socket: Socket) {
        console.log('Init')
    }
    async handleConnection(socket: Socket) {
        const authHeader = socket.handshake.headers.authorization
        if (authHeader && authHeader.split(' ')[1]) {
            try {
                socket.data.userID = (await this.authService.validateToken(authHeader.split(' ')[1])).id
                socket.join(socket.data.userID)
            } catch (error) {
                socket.disconnect()
            }
        } else socket.disconnect()
    }
    handleDisconnect(@ConnectedSocket() socket: Socket) {
        console.log('Client disconnected:', socket.id)
    }
    @SubscribeMessage('private_message')
    async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data) {
        await this.handleEmitSocket('receive_private_message', data, data.recipientId, socket)
    }
    async handleEmitSocket(eventName: string, data: IConversation, to: string, socket: Socket) {
        const isValid = await this.userService.handleConversation(socket.data.userID, to, data.role)
        if (isValid) {
            this.server.to(to).emit(eventName, data)
            this.conversationService.insertConversation(socket.data.userID, to, data.role, data.message)
        }
    }
}

export interface IConversation {
    recipientId: string
    message: string
    role: RoleConversation
}

export enum RoleConversation {
    AGENCY = 'AGENCY',
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN'
}