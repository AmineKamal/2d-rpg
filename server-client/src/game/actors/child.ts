import { Actor, Color } from 'excalibur';

export class Child extends Actor {
  private dx = 0;
  private dy = 0;
  private holder: Actor;
  public name = '';

  public constructor(
    holder: Actor,
    dx: number,
    dy: number,
    width?: number,
    height?: number,
    color?: Color
  ) {
    super(holder.pos.x + dx, holder.pos.y + dy, width, height, color);
    this.dx = dx;
    this.dy = dy;
    this.holder = holder;
  }

  public draw(ctx: CanvasRenderingContext2D, delta: number) {
    this.pos.x = this.holder.pos.x + this.dx;
    this.pos.y = this.holder.pos.y + this.dy;
    super.draw(ctx, delta);
  }

  public relocate() {
    this.pos.x = this.holder.pos.x + this.dx;
    this.pos.y = this.holder.pos.y + this.dy;
  }

  public rel(dx: number, dy: number) {
    this.dx = dx;
    this.dy = dy;
  }
}
