import { StrictMap } from "simple-structures/lib/lib/types";
import { initStrict } from "simple-structures/lib/lib/object";
import { User } from "../classes/user";
import { MapLocation, MAPS, IUser } from "../shared";
import { location as loc } from "../data/locations";
import { MapEnemyManager } from "./map.enemy.manager";
import { SocketDispatcher } from "../socket/dispatcher";
import { MapLootManager } from "./map.loot.manager";

export class MapUserManager {
  public constructor(enemyManager: MapEnemyManager) {
    this.enemyManager = enemyManager;
  }

  private enemyManager: MapEnemyManager;
  private users: StrictMap<MapLocation, User[]> = initStrict(MAPS, []);
  private ai: StrictMap<MapLocation, SocketDispatcher> = {} as any;

  public async addAi(map: MapLocation, s: SocketDispatcher) {
    this.ai[map] = s;

    const users = this.pick(this.users[map]);
    const enemies = this.enemyManager.get(map);
    await s.emit.init({ map, users, enemies, loots: [] });
  }

  public async add(user: User) {
    const { location } = user;

    this.broadcast(location.map).forEach((s) => s.emit.joined(user.export()));
    this.users[location.map].push(user);

    const users = this.pick(this.users[user.location.map]);
    const enemies = this.enemyManager.get(location.map);

    const map = location.map;
    const loots = MapLootManager.get().asArray(map);
    await user.s.emit.init({ map, users, enemies, loots });
  }

  public move(name: string, map: MapLocation) {
    const users = this.remove(name);

    if (users.length > 0) {
      const l = loc(users[0].location.map, map);
      users[0].location.pos.x = l.x;
      users[0].location.pos.y = l.y;
      users[0].location.map = map;
      return this.add(users[0]);
    }
  }

  public remove(name: string) {
    const { i, m } = this.find(name);

    if (i > -1) {
      const sliced = this.users[m].splice(i, 1);
      this.broadcast(m).forEach((s) => s.emit.left(name));
      return sliced;
    }

    return [];
  }

  public find(name: string) {
    let m: MapLocation;

    for (m of MAPS) {
      const i = this.users[m].findIndex((u) => u.name === name);
      if (i !== -1) return { i, m };
    }

    return { i: -1 };
  }

  public filterAi(name: string) {
    const { i, m } = this.find(name);
    if (i === -1) return undefined;

    return { ai: this.ai[m], m };
  }

  // finds all the users in the same map as the named user
  public filter(name: string, all = true) {
    const { i, m } = this.find(name);
    if (i === -1) return [];

    return all ? this.broadcast(m) : this.broadcastUsers(m);
  }

  public pick(users: User[]): IUser[] {
    return users.map((u) => u.export());
  }

  public broadcast(m: MapLocation) {
    const sockets = [...this.users[m].map((u) => u.s)];
    if (this.ai[m]) sockets.push(this.ai[m]);

    return sockets;
  }

  public broadcastUsers(m: MapLocation) {
    return [...this.users[m].map((u) => u.s)];
  }
}
