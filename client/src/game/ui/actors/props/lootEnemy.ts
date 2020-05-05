import { Prop } from './prop';
import { CollisionStartEvent, Sprite } from 'excalibur';
import { Player } from '../players/player';
import { State } from 'src/game/data/state';
import { Loot } from '../../gui/loot';

export class LootEnemy extends Prop {
  private ID: string;

  public constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    id: string,
    s: Sprite
  ) {
    super({ x, y, width, height }, s, false);
    this.ID = id;
  }

  protected onColStart(_: CollisionStartEvent<Player>) {
    const interaction = State.get().interaction;

    interaction.activate('loot', async () => {
      State.get().loot.setCurrent(this.ID);
      Loot.toggle();
    });
  }

  protected onColEnd(_: CollisionStartEvent<Player>) {
    Loot.hide();
    this.setDrawing('normal');
  }
}
