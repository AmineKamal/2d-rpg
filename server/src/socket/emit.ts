import {
  ServerEvent,
  SocketEmitAction,
  InitGame,
  IPlayerMovement,
  IUser,
  TrackAI,
  IEquipItem,
  IUserAttack,
  IUpdateLoot,
} from "../shared";
import { SocketManager } from "./socket";
import { StrictMap } from "simple-structures/lib/lib/types";

function emitAction<I, O>(e: ServerEvent, m: SocketManager) {
  return (data: I) => {
    return m.emit<I, O>(e, data);
  };
}

type SocketEmitStrict = StrictMap<ServerEvent, SocketEmitAction<any, any>>;

export class SocketEmit implements SocketEmitStrict {
  public constructor(
    m: SocketManager,
    public move = emitAction<IPlayerMovement, void>("move", m),
    public init = emitAction<InitGame, void>("init", m),
    public joined = emitAction<IUser, void>("joined", m),
    public left = emitAction<string, void>("left", m),
    public track = emitAction<TrackAI, void>("track", m),
    public equip = emitAction<IEquipItem, void>("equip", m),
    public attack = emitAction<IUserAttack, void>("attack", m),
    public evaluateAttack = emitAction<string, string[]>("evaluateAttack", m),
    public loot = emitAction<IUpdateLoot, void>("loot", m)
  ) {}
}
