import { StrictMap } from 'simple-structures';
import { Direction, IPlayerMovement } from '../../shared';
import { Players } from './players';
import { Sock } from '../../socket/dispatcher';
import { Player } from './player';
import { Vector } from 'excalibur';

export const VELOCITY: (dir: Direction) => readonly [number, number] = (
  dir: Direction
) => {
  if (dir < 0) return [0, 0];

  const v = Vector.fromAngle((dir * Math.PI) / 180); // dir is in degrees
  return [v.x, -v.y] as const;
};

export class PlayerMovement {
  private static initialized = false;

  public static init() {
    if (this.initialized) return;

    Sock.on.move(async (mv) => this.onMove(mv));
    this.initialized = true;
  }

  private static onMove(mv: IPlayerMovement) {
    const p = Players.get().find(mv.name);
    if (mv.dir === 'end') this.end(p, mv.pos);
    else this.move(p, mv.dir, mv.speed);
  }

  private static move(p: Player, dir: Direction, speed: number) {
    const [vx, vy] = VELOCITY(dir);
    p.vel.x = vx * speed;
    p.vel.y = vy * speed;
    p.dir = dir;
  }

  private static end(p: Player, pos: { x: number; y: number }) {
    p.vel.x = 0;
    p.vel.y = 0;
    p.pos.x = pos.x;
    p.pos.y = pos.y;
  }
}
