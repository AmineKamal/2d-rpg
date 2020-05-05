import * as Tiled from '../../../core/tiled';
import { Sprite, CollisionStartEvent, CollisionType } from 'excalibur';
import { Prop } from './prop';
import { Player } from '../players/player';
import { State } from '../../../data/state';
import { Resources } from '../../../core/resources';

export class Tree extends Prop {
  private cutted = false;

  public static async create(obj: Tiled.Object, s: Sprite) {
    const tree = new Tree(obj, s);
    const path = `./assets/maps/objects/tree_cut.png`;
    const sprite = (await Resources().get(path)).asSprite();
    tree.addDrawing('cutted', sprite);
    return tree;
  }

  private constructor(obj: Tiled.Object, s: Sprite) {
    super(obj, s);
  }

  protected onColStart(_: CollisionStartEvent<Player>) {
    const interaction = State.get().interaction;

    interaction.activate('woodcutting', async () => {
      this.body.collider.type = CollisionType.PreventCollision;
      this.setDrawing('cutted');
      this.cutted = true;

      setTimeout(() => {
        this.body.collider.type = CollisionType.Passive;
        this.setDrawing('normal');
        this.cutted = false;
      }, 5000);
    });
  }

  protected onColEnd(_: CollisionStartEvent<Player>) {
    if (!this.cutted) this.setDrawing('normal');
  }
}
