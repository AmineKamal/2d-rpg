import { Animatable as A, AnimatableArgs } from '../animatable';
import { CombatStat, IStat, AIEnemy } from '../../../shared';
import { StrictMap } from 'simple-structures';
import { Colorize } from 'excalibur/dist/Drawing/SpriteEffects';
import { Color } from 'excalibur';

interface AIArgs<SP extends string> extends AnimatableArgs<SP> {
  tracked?: boolean;
  stats: StrictMap<CombatStat, IStat>;
  threat: number;
}

export abstract class AI<SP extends string> extends A<SP> {
  public stats: StrictMap<CombatStat, IStat>;
  protected threat: number;

  constructor(args: AIArgs<SP>) {
    super(args);
    this.stats = args.stats;
    this.threat = args.threat;
  }

  public track(track: AIEnemy) {
    if (track.movement.pos) {
      this.pos.x = track.movement.pos.x;
      this.pos.y = track.movement.pos.y;
    }

    this.vel.x = track.movement.velx;
    this.vel.y = track.movement.vely;
    this.dir = track.movement.dir;
    this.setAnimation(track.movement.anim);
  }

  public get speed() {
    return Math.floor((this.stats?.agility?.points ?? 0) * 0.5 + 20);
  }
}
