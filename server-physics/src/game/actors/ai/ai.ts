import { Animatable, AnimatableArgs } from '../animatable';
import { Tasks } from './tasks';
import { Engine } from '../../core/engine';
import { TrackAI, CombatStat, IStat, AIEnemy } from '../../shared';
import { StrictMap } from 'simple-structures';

interface AIArgs extends AnimatableArgs {
  stats: StrictMap<CombatStat, IStat>;
  threat: number;
}

export abstract class AI extends Animatable {
  public tasks: Tasks;
  public stats: StrictMap<CombatStat, IStat>;
  protected threat: number;

  constructor(args: AIArgs) {
    super(args);
    this.stats = args.stats;
    this.threat = args.threat;
    this.tasks = new Tasks(this);
    this.subscribeEngine();
  }

  public track(track: AIEnemy) {
    if (track.movement.pos) {
      this.pos.x = track.movement.pos.x;
      this.pos.y = track.movement.pos.y;
    }

    this.vel.x = track.movement.velx;
    this.vel.y = track.movement.vely;
    this.dir = track.movement.dir;

    if (track.current === 'dead') {
      Engine.get().removeActor(this.export());
    }
  }

  public get speed() {
    return Math.floor((this.stats?.agility?.points ?? 0) * 0.5 + 20);
  }

  private subscribeEngine() {
    Engine.get().started.subscribe((started) => {
      if (started) this.tasks.routine.start();
      else this.tasks.stopAll();
    });
  }
}
