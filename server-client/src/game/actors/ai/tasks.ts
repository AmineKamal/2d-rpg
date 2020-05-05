import { Actor } from 'excalibur';
import { run, any, Task, StrictMap } from 'simple-structures';
import { IDLE_MAP, MOVE_MAP } from '../../core/animation.maps';
import { Direction, AIMovement, TaskType } from '../../shared';
import { AI } from './ai';
import { Tracker } from './tracker';
import { GAME_TICK } from 'src/game/constants';

type StrictTasks = StrictMap<TaskType, ActionTask<any, any> | (() => void)>;
export class Tasks implements StrictTasks {
  private actor: AI;

  public current: TaskType;
  public routine: ActionTask<void, boolean | void>;
  public follow: ActionTask<Actor, boolean | void>;

  public constructor(actor: AI) {
    this.actor = actor;

    this.routine = new ActionTask(
      this,
      'routine',
      () => this.routineTask(),
      (track?: boolean) => this.stop(track)
    );

    this.follow = new ActionTask(
      this,
      'follow',
      (i: Actor) => this.followTask(i),
      (track?: boolean) => this.stop(track)
    );
  }

  public stopAll() {
    this.routine.stop();
    this.follow.stop();
  }

  public dead() {
    console.log('DEAD');
    this.routine.stop(false);
    this.follow.stop(false);
    this.current = 'dead';

    const velx = 0;
    const vely = 0;

    const dir = this.actor.dir;
    const anim = 'dead';
    const x = this.actor.pos.x;
    const y = this.actor.pos.y;
    const pos = { x, y };

    this.track({ velx, vely, dir, anim, pos });
  }

  private routineTask() {
    const routine = () => {
      const vx = any([-1, 1]);
      const vy = any([-1, 1]);
      const xgreater = any([true, false]);
      this.move(xgreater, vx, vy);
    };

    const t = run(() => routine()).every(10 * GAME_TICK);
    t.start();

    routine();
    return t;
  }

  private followTask(actor: Actor) {
    const follow = () => {
      const vx = actor.pos.x - this.actor.pos.x > 0 ? 1 : -1;
      const vy = actor.pos.y - this.actor.pos.y > 0 ? 1 : -1;
      const dx = Math.abs(actor.pos.x - this.actor.pos.x);
      const dy = Math.abs(actor.pos.y - this.actor.pos.y);
      const xgreater = dx > dy;
      this.move(xgreater, vx, vy);
    };

    const t = run(() => follow()).every(GAME_TICK);
    t.start();

    follow();
    return t;
  }

  private track(movement: AIMovement) {
    const id = this.actor.ID;
    const current = this.current;
    const track = { id, movement, current };

    Tracker.get().update(id, track);
  }

  private move(xgreater: boolean, vx: number, vy: number) {
    const xanim = vx > 0 ? 'right' : 'left';
    const yanim = vy > 0 ? 'down' : 'up';

    const velx = xgreater ? vx * this.actor.speed : 0;
    const vely = xgreater ? 0 : vy * this.actor.speed;
    const dir: Direction = xgreater ? xanim : yanim;
    const anim = MOVE_MAP[dir];
    const x = this.actor.pos.x;
    const y = this.actor.pos.y;
    const pos = { x, y };

    this.track({ velx, vely, dir, anim, pos });
  }

  private stop(track = true) {
    if (!track) return;

    const velx = 0;
    const vely = 0;
    const dir = this.actor.dir;
    const anim = IDLE_MAP[this.actor.dir];
    const x = this.actor.pos.x;
    const y = this.actor.pos.y;
    const pos = { x, y };

    this.track({ velx, vely, dir, anim, pos });
  }
}

class ActionTask<I, II> {
  private _task: Task;
  private _tasks: Tasks;
  private name: TaskType;
  start: (i: I) => void;
  stop: (i: II) => void;

  public constructor(
    tasks: Tasks,
    name: TaskType,
    start: (i: I) => Task,
    stop: (i: II) => void
  ) {
    this._tasks = tasks;
    this.name = name;
    this.start = (i: I) => this._start(() => start(i));
    this.stop = (i: II) => this._stop(() => stop(i));
  }

  private _start(init: () => Task) {
    this._tasks.current = this.name;
    if (this._task) this._task.stop();
    this._task = init();
  }

  private _stop(stop: () => void) {
    this._tasks.current = undefined;
    if (this._task) this._task.stop();
    stop();
  }
}
