import {
  Actor,
  Engine,
  CollisionStartEvent,
  Sprite,
  CollisionType,
  Color,
} from 'excalibur';
import * as Tiled from '../../core/tiled';
import { Player } from '../players/player';
import { PropType, PropSprite } from './props';

export abstract class Prop extends Actor {
  protected type: PropType;

  public constructor(o: Tiled.Object, s: Sprite) {
    const x = o.x + o.width / 2;
    const y = o.y - o.height / 2;

    super(x, y, o.width, o.height);

    this.type = o.type as PropType;
    this.body.collider.type = CollisionType.Passive;

    const highlight = s.clone();
    highlight.colorize(Color.fromHex('#FFD700'));

    this.addSprite('normal', s);
    this.addSprite('highlight', highlight);
    this.setSprite('normal');

    this.onCollision();
  }

  public draw(ctx: CanvasRenderingContext2D, delta: number) {
    super.draw(ctx, delta);
    this.setZIndex(this.pos.y);
  }

  public update(engine: Engine, delta: number) {
    super.update(engine, delta);
  }

  public setSprite(key: PropSprite) {
    super.setDrawing(key);
  }

  public addSprite(key: PropSprite, sprite: Sprite) {
    super.addDrawing(key, sprite);
  }

  private onCollision() {
    this.on('collisionstart', (ev: CollisionStartEvent<Player>) => {});

    this.on('collisionend', (ev: CollisionStartEvent<Player>) => {});
  }

  protected abstract onColStart(ev: CollisionStartEvent<Player>): void;
  protected abstract onColEnd(ev: CollisionStartEvent<Player>): void;
}
