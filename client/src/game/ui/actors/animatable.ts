import { Actor, Label, Color, TextAlign, CollisionType } from 'excalibur';
import { Direction, PlayerAnimation, ILocation } from '../../shared';

export interface AnimatableArgs<Sprite extends string> {
  location: ILocation;
  sprite: Sprite;
  name: string;
  w: number;
  h: number;
  id: string;
}

export class Animatable<Sprite extends string> extends Actor {
  public dir: Direction;
  public sprite: Sprite;
  public name: string;
  public ID: string;
  protected nameLabel: Label;
  protected currentAnimation: PlayerAnimation;
  private animationLocked = false;

  public constructor(args: AnimatableArgs<Sprite>) {
    super(args.location.pos.x, args.location.pos.y, args.w, args.h);
    this.ID = args.id;
    this.body.collider.type = CollisionType.Active;
    this.name = args.name;
    this.sprite = args.sprite;
    this.dir = 'down';
    this.add(this.label());
  }

  public setAnimation(d: PlayerAnimation, rst = false) {
    if (this.animationLocked) return;
    if (this.currentAnimation === d && rst) return this.currentDrawing.reset();
    this.setDrawing(d);
    this.currentAnimation = d;
  }

  public lockAnimation() {
    this.animationLocked = true;
  }

  public unlockAnimation() {
    this.animationLocked = false;
  }

  public draw(ctx: CanvasRenderingContext2D, delta: number) {
    super.draw(ctx, delta);
    this.setZIndex(this.pos.y);
  }

  public export(): Actor[] {
    return [this];
  }

  private label() {
    const label = new Label(this.name, 0, -20, 'Arial');
    label.fontSize = 10;
    label.color = Color.White;
    label.textAlign = TextAlign.Center;
    this.nameLabel = label;

    return this.nameLabel;
  }
}
