import { IUser } from '../../shared';
import { Animatable } from '../animatable';
import { Actor, Color } from 'excalibur';
import { PlayerTasks } from './player.tasks';
import { Enemies } from '../ai/enemies/enemies';

const PW = 32 as const;
const PH = 32 as const;

export class Player extends Animatable {
  private constructor(init: IUser) {
    super({ ...init, w: PW, h: PH, id: '' });
    this.tasks = new PlayerTasks(this);
    this.color = Color.Blue;
  }

  public tasks: PlayerTasks;

  public static async init(init: IUser) {
    const p = new Player(init);
    return p;
  }

  public export(): Actor[] {
    return [...super.export()];
  }

  public evaluateAttack() {
    const enemies = Enemies.get().enemies;

    const touching = enemies.filter((e) =>
      e.body.collider.bounds.intersect(
        this.attackBox.actor.body.collider.bounds
      )
    );

    return touching.map((e) => e.ID);
  }
}
