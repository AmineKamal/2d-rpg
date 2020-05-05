import { UIActor, Color } from 'excalibur';
import { Engine } from '../../core/engine';

const W = 100;
const H = 500;

export class Stats extends UIActor {
  public constructor() {
    const game = Engine.get();
    const x = game.drawWidth / 2;
    const y = game.drawHeight / 2;
    super(x, y, W, H);
    this.color = Color.Black;
  }
}
