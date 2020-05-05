import { Socket } from './socket';
import { SocketEmit } from './emit';
import { SocketOn } from './on';

class SocketDispatcher {
  private static instance: SocketDispatcher;

  private constructor(
    m = Socket.get(),
    public emit = new SocketEmit(m),
    public on = new SocketOn(m)
  ) {}

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new SocketDispatcher();
    return this.instance;
  }
}

export const Sock = SocketDispatcher.get();
