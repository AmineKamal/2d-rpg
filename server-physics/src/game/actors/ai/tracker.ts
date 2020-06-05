import { AIEnemy } from '../../shared';
import { Map, Task, run } from 'simple-structures';
import { State } from '../../state';
import { Sock } from '../../socket/dispatcher';
import { Enemies } from './enemies/enemies';
import { Players } from '../players/players';
import { GAME_TICK } from 'src/game/constants';
import { Engine } from 'src/game/core/engine';

export class Tracker {
  private static instance: Tracker;
  private tracked: Map<AIEnemy> = {};
  private task: Task;

  private constructor() {
    Engine.get().started.subscribe((state) => {
      if (state) this.start();
      else this.stop();
    });
  }

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new Tracker();
    return this.instance;
  }

  update(id: string, track: AIEnemy) {
    this.tracked[id] = track;
  }

  publish() {
    if (Players.get().players.length === 0) return;

    const map = State.get().map;
    const enemies = Object.values(this.tracked);

    enemies.forEach((t) => {
      const e = Enemies.find(t.id);
      if (e) {
        const x = e.pos.x;
        const y = e.pos.y;
        t.movement.pos = { x, y };
      }
    });

    if (enemies.length > 0) {
      Sock.emit.track({ map, enemies });
    }
  }

  start() {
    if (this.task) this.task.stop();
    this.task = run(() => this.publish()).every(10 * GAME_TICK);
    this.task.start();
  }

  stop() {
    this.task.stop();
  }
}
