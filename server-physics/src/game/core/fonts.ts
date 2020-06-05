import { StrictMap } from 'simple-structures';
import { SpriteFont } from 'excalibur';
import { Resources } from './resources';

const FONTS = ['black', 'branca', 'fonteamarela', 'lilas', 'vermelha'] as const;
export type Font = typeof FONTS[number];

export class Fonts implements StrictMap<Font, SpriteFont> {
  private static instance: Fonts;

  public black: SpriteFont;
  public branca: SpriteFont;
  public fonteamarela: SpriteFont;
  public lilas: SpriteFont;
  public vermelha: SpriteFont;

  public static get() {
    return this.instance;
  }

  public static async load() {
    if (this.instance) return;

    this.instance = new Fonts();

    const path = `./assets/fonts/`;
    const txts = await Promise.all(
      FONTS.map(f => Resources().get(path + f + '.png'))
    );

    const alph = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ:/,!+-%';

    FONTS.forEach(
      (f, i) =>
        (this.instance[f] = new SpriteFont(txts[i], alph, true, 5, 9, 64, 64))
    );
  }
}
