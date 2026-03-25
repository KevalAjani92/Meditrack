import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/',
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('EventsGateway');

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    // Allow clients to join rooms based on query params
    const doctorId = client.handshake.query.doctorId;
    const hospitalId = client.handshake.query.hospitalId;

    if (doctorId) {
      client.join(`doctor:${doctorId}`);
      this.logger.log(`Client ${client.id} joined room doctor:${doctorId}`);
    }

    if (hospitalId) {
      client.join(`hospital:${hospitalId}`);
      this.logger.log(
        `Client ${client.id} joined room hospital:${hospitalId}`,
      );
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // ─── Emit Methods (called from services) ────────────────────

  /**
   * Emit queue update to a specific doctor's room
   */
  emitQueueUpdate(doctorId: number, data: any) {
    this.server.to(`doctor:${doctorId}`).emit('queue:updated', data);
    this.logger.log(`Emitted queue:updated to doctor:${doctorId}`);
  }

  /**
   * Emit consultation completed event
   */
  emitConsultationCompleted(doctorId: number, opdId: number) {
    this.server
      .to(`doctor:${doctorId}`)
      .emit('consultation:completed', { opdId });
    this.logger.log(
      `Emitted consultation:completed to doctor:${doctorId} for OPD ${opdId}`,
    );
  }

  /**
   * Emit to entire hospital room (for receptionist/admin views)
   */
  emitHospitalQueueUpdate(hospitalId: number, data: any) {
    this.server.to(`hospital:${hospitalId}`).emit('queue:updated', data);
  }
}
