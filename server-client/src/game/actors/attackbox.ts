import { Child } from './child';
import { Actor, Color, CollisionType } from 'excalibur';

export class AttackBox {
  // Size of the attack Box
  private w: number;
  private h: number;

  // height and with of the parent
  private pwidth: number;
  private pheight: number;

  public actor: Child;

  public constructor(w: number, h: number, holder: Actor) {
    this.w = w;
    this.h = h;
    this.pwidth = holder.width;
    this.pheight = holder.height;

    // Down Sprite
    this.actor = new Child(
      holder,
      0,
      this.pheight / 2 + this.h / 2,
      this.w,
      this.h,
      Color.Azure
    );

    this.actor.body.collider.type = CollisionType.PreventCollision;
    this.actor.visible = true;
  }

  public export() {
    return this.actor;
  }

  public down() {
    this.actor.width = this.w;
    this.actor.height = this.h;
    this.actor.rel(0, this.pheight / 2 + this.h / 2);
  }

  public up() {
    this.actor.width = this.w;
    this.actor.height = this.h;
    this.actor.rel(0, -1 * (this.pheight / 2 + this.h / 2));
  }

  public right() {
    this.actor.width = this.h;
    this.actor.height = this.w;
    this.actor.rel(this.pwidth / 2 + this.h / 2, 0);
  }

  public left() {
    this.actor.width = this.h;
    this.actor.height = this.w;
    this.actor.rel(-1 * (this.pwidth / 2 + this.h / 2), 0);
  }
}
