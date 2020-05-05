import {
  Actor,
  Engine,
  CollisionStartEvent,
  Sprite,
  CollisionType,
  Color,
} from 'excalibur';
import { Player } from '../players/player';
import { State } from '../../../data/state';
import { PropSprite } from './props';

export interface PropParams {
  x: number;
  y: number;
  width: number;
  height: number;
}

export abstract class Prop extends Actor {
  public constructor(o: PropParams, s: Sprite, adjust = true) {
    const x = adjust ? o.x + o.width / 2 : o.x;
    const y = adjust ? o.y - o.height / 2 : o.y;

    super(x, y, o.width, o.height);

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
    this.on('collisionstart', (ev: CollisionStartEvent<Player>) => {
      if (!ev.other.name || ev.other.name !== State.get().player.name) return;
      this.setSprite('highlight');
      this.onColStart(ev);
    });

    this.on('collisionend', (ev: CollisionStartEvent<Player>) => {
      if (!ev.other.name || ev.other.name !== State.get().player.name) return;
      this.onColEnd(ev);
      State.get().interaction.deactivate();
    });
  }

  protected abstract onColStart(ev: CollisionStartEvent<Player>): void;
  protected abstract onColEnd(ev: CollisionStartEvent<Player>): void;
}
