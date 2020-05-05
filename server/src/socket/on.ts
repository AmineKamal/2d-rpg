import {
  ClientEvent,
  SocketOnAction,
  IPlayerMovement,
  MapLocation,
  TrackAI,
  ICreateAccount,
  IItem,
  IUser,
  IUpdateLoot,
} from "../shared";
import { SocketManager } from "./socket";
import { StrictMap } from "simple-structures/lib/lib/types";

function onAction<I, O>(e: ClientEvent, m: SocketManager) {
  return (f: (data: I) => Promise<O>) => {
    return m.on<I, O>(e, f);
  };
}

type SocketOnStrict = StrictMap<ClientEvent, SocketOnAction<any, any>>;

export class SocketOn implements SocketOnStrict {
  public constructor(
    m: SocketManager,
    public move = onAction<IPlayerMovement, void>("move", m),
    public teleport = onAction<MapLocation, void>("teleport", m),
    public track = onAction<TrackAI, void>("track", m),
    public create = onAction<ICreateAccount, boolean>("create", m),
    public ai = onAction<MapLocation, void>("ai", m),
    public equip = onAction<IItem, void>("equip", m),
    public attack = onAction<void, void>("attack", m),
    public loot = onAction<IUpdateLoot, Partial<IUser>>("loot", m)
  ) {}
}
