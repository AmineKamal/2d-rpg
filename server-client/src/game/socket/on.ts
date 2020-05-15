import {
  ServerEvent,
  SocketOnAction,
  InitGame,
  IPlayerMovement,
  IUser,
  TrackAI,
  IUserAttack,
} from '../shared';
import { Socket } from './socket';
import { StrictMap } from 'simple-structures';

function onAction<I, O>(e: ServerEvent, m: Socket) {
  return (f: (data: I) => Promise<O>) => {
    return m.on<I, O>(e, f);
  };
}

type SocketOnStrict = StrictMap<ServerEvent, SocketOnAction<any, any>>;

export class SocketOn implements SocketOnStrict {
  public constructor(
    m: Socket,
    public move = onAction<IPlayerMovement, void>('move', m),
    public init = onAction<InitGame, void>('init', m),
    public joined = onAction<IUser, void>('joined', m),
    public left = onAction<string, void>('left', m),
    public track = onAction<TrackAI, void>('track', m),
    public equip = onAction<void, void>('equip', m),
    public evaluateAttack = onAction<string, string[]>('evaluateAttack', m),
    public attack = onAction<IUserAttack, void>('attack', m),
    public loot = onAction<void, void>('loot', m)
  ) {}
}
