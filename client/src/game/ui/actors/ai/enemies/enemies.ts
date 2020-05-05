import { Enemy } from './enemy';
import { IEnemy } from '../../../../shared';
import { Engine } from '../../../../core/engine';
import { Sock } from '../../../../socket/dispatcher';
import { LootEnemy } from '../../props/lootEnemy';

export class Enemies {
  private constructor() {}
  private static instance: Enemies;

  public enemies: Enemy[] = [];
  public props: LootEnemy[] = [];

  public static get() {
    if (this.instance) return this.instance;
    this.instance = new Enemies();

    Sock.on.track(async (track) =>
      track.enemies?.forEach((t) => this.find(t.id)?.track(t))
    );

    return this.instance;
  }

  public static find(id: string) {
    return this.instance.find(id);
  }

  public async populate(enemies: IEnemy[]) {
    this.enemies.forEach((e) => Engine.get().removeActor(e.export()));
    const dead = enemies.filter((e) => e.dead);
    const alive = enemies.filter((e) => !e.dead);

    this.enemies = await Promise.all(alive.map((e) => Enemy.create(e)));
    this.props = await Promise.all(dead.map((e) => Enemy.createProp(e)));
  }

  public removeEnemy(id: string) {
    const i = this.enemies.findIndex((p) => p.ID === id);
    if (i === -1) return;
    const rm = this.enemies.splice(i, 1)[0];
    Engine.get().removeActor(rm.export());

    return rm;
  }

  public kill(id: string) {
    const enemy = this.removeEnemy(id);
    const prop = enemy.createProp();
    this.props.push(prop);
    Engine.get().addActor(prop);
  }

  public find(id: string) {
    return this.enemies.find((e) => e.ID === id);
  }
}
