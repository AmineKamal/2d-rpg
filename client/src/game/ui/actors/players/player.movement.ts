import { StrictMap } from 'simple-structures';
import { Direction, IPlayerMovement } from '../../../shared';
import { LeftJoystick } from '../../../core/leftJoystick';
import { Players } from './players';
import { Sock } from '../../../socket/dispatcher';
import { Player } from './player';
import { State } from '../../../data/state';
import { IDLE_MAP, MOVE_MAP } from '../../../core/animation.maps';
import { Actions } from 'src/game/core/actions';
import { Engine } from 'src/game/core/engine';

const VELOCITY: StrictMap<Direction, readonly [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  right: [1, 0],
  left: [-1, 0],
} as const;

export class PlayerMovement {
  private static initialized = false;

  public static init() {
    if (this.initialized) return;

    const j = LeftJoystick.get();

    j.dir((d) => Sock.emit.move(this.nextMove(d)));
    j.end(() => Sock.emit.move(this.nextMove('end')));

    Actions.get().dash(async () => {
      j.lock();
      Sock.emit.move(this.nextMove(undefined, true, j.allup));
      setTimeout(() => j.unlock(true), 300);
    });

    Sock.on.move(async (mv) => this.onMove(mv));
    this.initialized = true;
  }

  private static nextMove(
    dir?: Direction | 'end',
    dash = false,
    reverse = false
  ) {
    const p = Players.get().self;
    dir = dir ? dir : p.dir;

    const name = p.name;
    const speed =
      State.get().player.stats.speed * (dash ? 4 : 1) * (reverse ? -1 : 1);

    const { x, y } = p.pos;
    const pos = { x, y };

    if (dir !== 'end') return { dir, name, speed };
    else return { dir, name, pos };
  }

  private static onMove(mv: IPlayerMovement) {
    const p = Players.get().find(mv.name);
    if (mv.dir === 'end') this.end(p, mv.pos);
    else this.move(p, mv.dir, mv.speed);
  }

  private static move(p: Player, dir: Direction, speed: number) {
    const [vx, vy] = VELOCITY[dir];
    p.vel.x = vx * speed;
    p.vel.y = vy * speed;
    p.dir = dir;

    // Dash
    if (speed > 250) p.dash = true;
    else p.dash = false;

    p.setAnimation(MOVE_MAP[dir]);
  }

  private static end(p: Player, pos: { x: number; y: number }) {
    p.vel.x = 0;
    p.vel.y = 0;
    p.pos.x = pos.x;
    p.pos.y = pos.y;
    p.dash = false;
    p.setAnimation(IDLE_MAP[p.dir]);
  }
}
