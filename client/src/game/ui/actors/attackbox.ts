import { Child } from './child';
import { Actor, Color, CollisionType } from 'excalibur';

export class AttackBox {
  // Size of the attack Box
  private dimx: number;
  private dimy: number;

  // height and with of the parent
  private width: number;
  private height: number;

  public actor: Child;

  public constructor(dimx: number, dimy: number, holder: Actor) {
    this.dimx = dimx;
    this.dimy = dimy;
    this.width = holder.width;
    this.height = holder.height;

    // Down Sprite
    this.actor = new Child(
      holder,
      0,
      this.height,
      this.dimx,
      this.dimy,
      Color.Red
    );

    this.actor.body.collider.type = CollisionType.Passive;
    this.actor.visible = false;
  }

  public export() {
    return this.actor;
  }

  public down() {
    this.actor.width = this.dimx;
    this.actor.height = this.dimy;
    this.actor.rel(0, this.height * 2 + 10);
  }

  public up() {
    this.actor.width = this.dimx;
    this.actor.height = this.dimy;
    this.actor.rel(0, -this.height * 2 + 30);
  }

  public right() {
    this.actor.width = this.dimy;
    this.actor.height = this.dimx;
    this.actor.rel(this.width * 2 - 10, this.height / 2);
  }

  public left() {
    this.actor.width = this.dimy;
    this.actor.height = this.dimx;
    this.actor.rel(-this.width * 2 + 10, this.height / 2);
  }
}
