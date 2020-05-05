import {
  ClientEvent,
  SocketEmitAction,
  IPlayerMovement,
  MapLocation,
  TrackAI,
  ICreateAccount,
} from '../shared';
import { Socket } from './socket';
import { StrictMap } from 'simple-structures';

function emitAction<I, O>(e: ClientEvent, m: Socket) {
  return (data: I) => {
    return m.emit<I, O>(e, data);
  };
}

type SocketEmitStrict = StrictMap<ClientEvent, SocketEmitAction<any, any>>;

export class SocketEmit implements SocketEmitStrict {
  public constructor(
    m: Socket,
    public move = emitAction<IPlayerMovement, void>('move', m),
    public teleport = emitAction<MapLocation, void>('teleport', m),
    public track = emitAction<TrackAI, void>('track', m),
    public create = emitAction<ICreateAccount, boolean>('create', m),
    public ai = emitAction<MapLocation, void>('ai', m),
    public equip = emitAction<void, void>('equip', m),
    public attack = emitAction<void, void>('attack', m)
  ) {}
}
