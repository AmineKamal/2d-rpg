import { Player } from './player';
import { IUser } from '../../shared';
import { Engine } from '../../core/engine';
import { Sock } from '../../socket/dispatcher';

export class Players {
  private constructor() {}

  private static instance: Players;

  public players: Player[] = [];

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new Players();

    Sock.on.joined(async (u) => this.instance.addPlayer(u));
    Sock.on.left(async (u) => this.instance.removePlayer(u));

    return this.instance;
  }

  public async addPlayer(user: IUser) {
    const p = await Player.init(user);
    this.players.push(p);
    Engine.get().addActor(p.export());
    Engine.get().startEngine();
  }

  public async removePlayer(name: string) {
    const i = this.players.findIndex((p) => p.name === name);
    if (i === -1) return;
    const rm = this.players.splice(i, 1);
    Engine.get().removeActor(rm[0].export());

    if (this.players.length <= 0) Engine.get().stopEngine();
  }

  public async populate(users: IUser[]) {
    this.players.forEach((p) => Engine.get().removeActor(p.export()));
    this.players = await Promise.all(users.map((u) => Player.init(u)));
  }

  public find(name: string) {
    return this.players.find((p) => p.name === name);
  }

  public isPlayer(name: string) {
    return this.players.findIndex((p) => p.name === name) !== -1;
  }
}
