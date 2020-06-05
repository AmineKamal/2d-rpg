import * as io from 'socket.io-client';
import { ServerEvent, ClientEvent } from '../shared';

const URL = 'http://192.168.0.121:3000';

export class Socket {
  private constructor() {
    this.s = io(URL);
  }

  private static instance: Socket;

  private s: SocketIOClient.Socket;

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new Socket();
    return this.instance;
  }

  public on<I, O>(ev: ServerEvent, f: (data: I) => Promise<O>) {
    this.s.on(ev, async (data: I, cb: (i: O) => void) => {
      cb ? cb(await f(data)) : await f(data);
    });
  }

  public emit<I, O>(ev: ClientEvent, data: I) {
    return new Promise<O>((resolve) => {
      this.s.emit(ev, data, resolve);
    });
  }
}
