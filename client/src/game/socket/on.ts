import {
  ServerEvent,
  SocketOnAction,
  InitGame,
  IPlayerMovement,
  IUser,
  TrackAI,
  IEquipItem,
  IUserAttack,
  IUpdateLoot,
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
    public equip = onAction<IEquipItem, void>('equip', m),
    public attack = onAction<IUserAttack, void>('attack', m),
    public evaluateAttack = onAction<void, void>('evaluateAttack', m),
    public loot = onAction<IUpdateLoot, void>('loot', m)
  ) {}
}
