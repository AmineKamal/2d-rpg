import { Socket } from "socket.io";
import { ClientEvent, ServerEvent } from "../shared";

export class SocketManager {
  private s: Socket;

  public get id() {
    return this.s.id;
  }

  public constructor(s: Socket) {
    this.s = s;
  }

  public on<I, O>(ev: ClientEvent, f: (data: I) => Promise<O>) {
    this.s.on(ev, async (data: I, cb: (i: O) => void) => {
      cb ? cb(await f(data)) : await f(data);
    });
  }

  public emit<I, O>(ev: ServerEvent, data: I) {
    return new Promise<O>(resolve => {
      this.s.emit(ev, data, resolve);
    });
  }
}
