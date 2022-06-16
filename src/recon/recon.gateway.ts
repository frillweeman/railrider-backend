import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import * as zmq from "zeromq";

// TODO: move business logic into a microservice
interface EOTData {
  unitAddress: number,
  pressure: number,
  motion: boolean,
  markerLight: boolean,
  turbine: boolean,
  batteryCondition: string,
  batteryCharge: number,
  armStatus: boolean
};

@WebSocketGateway({ namespace: "recon" })
export class ReconGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  trains: number[] = [];
  @WebSocketServer() server: Server;

  async afterInit(server: Server) {
    const sub = new zmq.Subscriber;
    sub.connect("tcp://localhost:4000");
    sub.subscribe();
    console.log("zmq subscriber connected");

    for await (const msg of sub) {
      const eotJSON: EOTData = JSON.parse(msg.toString())
      this.server.emit("nearbyTrains", eotJSON);
    }
  }

  handleConnection(socket: Socket) {
    console.log(`new connection from ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`client disconnected: ${socket.id}`);
  }
}
