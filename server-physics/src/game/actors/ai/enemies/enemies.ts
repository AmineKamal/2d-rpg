import { Enemy } from './enemy';
import { IEnemy } from '../../../shared';
import { Engine } from '../../../core/engine';
import { Sock } from '../../../socket/dispatcher';

export class Enemies {
  private constructor() {}
  private static instance: Enemies;

  public enemies: Enemy[] = [];

  public static get() {
    if (this.instance) return this.instance;
    this.instance = new Enemies();

    Sock.on.track(async (track) =>
      track.enemies.forEach((t) => this.find(t.id)?.track(t))
    );

    return this.instance;
  }

  public static find(id: string) {
    return this.instance.find(id);
  }

  public async populate(enmies: IEnemy[]) {
    this.enemies.forEach((e) => e.tasks.stopAll());
    this.enemies.forEach((e) => Engine.get().removeActor(e.export()));
    this.enemies = await Promise.all(enmies.map((e) => Enemy.create(e)));
  }

  public find(id: string) {
    return this.enemies.find((e) => e.ID === id);
  }
}
