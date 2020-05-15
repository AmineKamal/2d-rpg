import { IUserEquipement, IUserDNA, EquipementSlot } from '../shared';
import { Resources } from './resources';

export class Drawer {
  private static instance: Drawer;

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new Drawer();
    return this.instance;
  }

  public static async draw(dna: IUserDNA, equip: Partial<IUserEquipement>) {
    const pre = './assets/characters/';

    const skin = this.path('dna', dna.sex, 'skin', dna.skin);
    const eyes = this.path('dna', dna.sex, 'eyes', dna.eyes);
    const hair = this.path('dna', dna.sex, 'hair', dna.hair, dna.hairColor);
    const shadow = this.path('shadows', 'shadow');

    const order: EquipementSlot[] = [
      'torso',
      'legs',
      'feet',
      'belt',
      'shoulders',
      'arms',
      'hands',
      'cape',
      'shield',
      'head',
      'weapon',
    ];

    const layers = [shadow, skin, eyes, hair];

    order.forEach((k) => {
      if (equip[k])
        layers.push(this.path('equipement', dna.sex, equip[k].equipSprite));
    });

    return await Resources().layers(layers, pre);
  }

  private static path(...items: string[]) {
    return items.reduce(
      (p, c, i) => p + c + (i === items.length - 1 ? '.png' : '/'),
      ''
    );
  }
}
