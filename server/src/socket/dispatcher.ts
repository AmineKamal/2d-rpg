import { Socket } from "socket.io";
import { SocketManager } from "./socket";
import { SocketEmit } from "./emit";
import { SocketOn } from "./on";

export class SocketDispatcher {
  public username?: string;
  public isAi!: boolean;

  public constructor(
    public s: Socket,
    private m = new SocketManager(s),
    public emit = new SocketEmit(m),
    public on = new SocketOn(m)
  ) {}

  public get id() {
    return this.m.id;
  }
}
