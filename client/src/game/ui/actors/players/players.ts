import { Player } from './player';
import { IUser, IEquipItem } from '../../../shared';
import { State } from '../../../data/state';
import { PlayerMovement } from './player.movement';
import { Engine } from '../../../core/engine';
import { Sock } from '../../../socket/dispatcher';

export class Players {
  private constructor() {}

  public get self() {
    return this.find(State.get().player.name);
  }
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
    Engine.get().addActor(p);
  }

  public removePlayer(name: string) {
    const i = this.players.findIndex((p) => p.name === name);
    if (i === -1) return;
    const rm = this.players.splice(i, 1);
    Engine.get().removeActor(rm[0].export());
  }

  public async populate(users: IUser[]) {
    this.players.forEach((p) => Engine.get().removeActor(p.export()));
    this.players = await Promise.all(users.map((u) => Player.init(u)));
    const current = users.find((u) => u.name === State.get().player.name);
    State.get().player.update(current);
    PlayerMovement.init();
  }

  public async equip(equip: IEquipItem) {
    const player = this.find(equip.name);
    if (!player) return;

    await player.redraw(equip.equipement);
    if (equip.name !== State.get().player.name) return;

    State.get().player.update(equip);
  }

  public find(name: string) {
    return this.players.find((p) => p.name === name);
  }

  public isPlayer(name: string) {
    return this.players.findIndex((p) => p.name === name) !== -1;
  }
}
