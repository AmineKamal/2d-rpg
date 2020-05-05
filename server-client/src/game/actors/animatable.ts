import { Actor, Label, Color, TextAlign, CollisionType } from 'excalibur';
import { Direction, PlayerAnimation, ILocation } from '../shared';
import { AttackBox } from './attackbox';

export interface AnimatableArgs {
  location: ILocation;
  name: string;
  w: number;
  h: number;
  id: string;
}

export class Animatable extends Actor {
  public dir: Direction;
  public name: string;
  public ID: string;
  protected attackBox: AttackBox;

  public constructor(args: AnimatableArgs) {
    super(args.location.pos.x, args.location.pos.y, args.w, args.h);
    this.ID = args.id;
    this.body.collider.type = CollisionType.Active;
    this.name = args.name;
    this.dir = 'down';
    this.createAttackBox();
  }

  public draw(ctx: CanvasRenderingContext2D, delta: number) {
    super.draw(ctx, delta);
    this.setZIndex(this.pos.y);
    this.updateAttackBox();
  }

  public export(): Actor[] {
    return [this, this.attackBox.export()];
  }

  private createAttackBox() {
    this.attackBox = new AttackBox(this.width * 2, this.height, this);
  }

  private updateAttackBox() {
    switch (this.dir) {
      case 'down':
        return this.attackBox.down();

      case 'up':
        return this.attackBox.up();

      case 'left':
        return this.attackBox.left();

      case 'right':
        return this.attackBox.right();
    }
  }
}
