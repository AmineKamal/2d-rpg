import { Sprite, Actor, CollisionType } from 'excalibur';
import { Engine as E } from 'src/game/core/engine';

export class Fade extends Actor {
  public static init({ x, y, width, height }: Actor, s: Sprite) {
    const f = new Fade({ x, y, width, height }, s);
    E.get().addActor(f);
  }

  public constructor({ x, y, width, height }, s: Sprite) {
    super({ x, y, width, height });
    this.addDrawing(s);
    this.opacity = 0.5;
    this.collisionType = CollisionType.PreventCollision;
  }

  public draw(ctx: CanvasRenderingContext2D, delta: number) {
    super.draw(ctx, delta);
    this.opacity -= 0.1;
    if (this.opacity <= 0) this.destroy();
  }

  private destroy() {
    E.get().removeActor(this);
  }
}
