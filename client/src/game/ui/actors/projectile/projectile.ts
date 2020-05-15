import {
  Actor,
  Color,
  Sprite,
  CollisionStartEvent,
  CollisionType,
} from 'excalibur';
import { Direction } from 'src/game/shared';
import { Engine } from 'src/game/core/engine';
import { VELOCITY } from '../players/player.movement';
import { Player } from '../players/player';
import { Enemy } from '../ai/enemies/enemy';
import { Animatable } from '../animatable';

export class Projectile extends Actor {
  private destroyed = false;

  public constructor(
    x: number,
    y: number,
    r: number,
    dir: Direction,
    speed: number,
    duration: number,
    creator: Player,
    sprite?: Sprite
  ) {
    super(x, y, r, r);

    if (sprite) this.addDrawing(sprite);
    else this.color = Color.Red;

    this.body.useCircleCollider(r);
    const [vx, vy] = VELOCITY(dir);
    this.vel.x = vx * speed;
    this.vel.y = vy * speed;

    Engine.get().addActor(this);
    this.onCollision(creator);
    setTimeout(() => this.destroy(), duration);
  }

  public draw(ctx: CanvasRenderingContext2D, delta: number) {
    super.draw(ctx, delta);
    this.setZIndex(this.pos.y);
  }

  private destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    Engine.get().removeActor(this);
  }

  private onCollision(creator: Player) {
    this.on('collisionstart', (evt: CollisionStartEvent<Animatable<any>>) => {
      if (
        evt.other.ID === creator.ID ||
        evt.other.body.collider.type === CollisionType.Passive
      )
        return;
      this.destroy();
    });
  }
}
