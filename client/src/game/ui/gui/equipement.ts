import { UIActor, Color, Texture, Label } from 'excalibur';
import { Resources } from '../../core/resources';
import { StrictMap } from 'simple-structures';
import { EquipementSlot, IItem } from '../../shared';
import { State } from '../../data/state';

const LEN = 64;
const W = 401;

export class Equipement extends UIActor {
  private static instance: Equipement;

  private slots: StrictMap<EquipementSlot, EquipSlot>;

  private constructor(equip: Texture, slot: Texture) {
    super(window.innerWidth / 2 - 200, window.innerHeight / 2 - 130, 401, 279);
    this.addDrawing(equip);
    this.visible = false;
    this.slots = initSlots((x, y, k) => new EquipSlot(x, y, slot, k));
    Object.values(this.slots).forEach((s) => this.add(s));
    this.subscribe();
  }

  public static async create() {
    if (this.instance) return this.instance;

    const slot = await Resources().get('./assets/gui/inventory-slot.png');
    const equip = await Resources().get('./assets/gui/equipement.png');
    this.instance = new Equipement(equip, slot);
    return this.instance;
  }

  public static get() {
    if (this.instance) return this.instance;
  }

  public static toggle() {
    const equipement = this.get();
    if (equipement) equipement.visible = !equipement.visible;
  }

  public static hide() {
    const equipement = this.get();
    if (equipement) equipement.visible = false;
  }

  private subscribe() {
    State.get().player._equipement.subscribe((e) => {
      Object.keys(e).forEach((k: EquipementSlot) => this.slots[k].equip(e[k]));
    });
  }
}

class EquipSlot extends UIActor {
  private item: IItem;
  private itemActor: UIActor;
  private drawings: string[] = [];
  private name: Label;

  public constructor(x: number, y: number, tex: Texture, name: string) {
    super(x, y, LEN, LEN);
    this.addDrawing(tex);
    this.itemActor = new UIActor(LEN / 4, LEN / 4);
    this.itemActor.visible = false;
    this.name = new Label(name, LEN / 2 - (5 + 1.5 * name.length), LEN / 2 + 5);
    this.name.color = Color.White;
    this.add(this.name);
    this.add(this.itemActor);
  }

  async equip(item?: IItem) {
    if (!item) return this.unequip();
    if (this.item?.name === item.name) return;

    if (this.drawings.includes(item.name))
      return this.itemActor.setDrawing(item.name);

    const sp = (await Resources().query(item.sprite)).asSprite();
    this.itemActor.addDrawing(item.name, sp);
    this.drawings.push(item.name);

    this.itemActor.setDrawing(item.name);
    this.itemActor.visible = true;
    this.name.visible = false;
    this.item = item;
  }

  unequip() {
    this.item = undefined;
    this.name.visible = true;
    this.itemActor.visible = false;
  }
}

function initSlots<T>(
  f: (x: number, y: number, k: string) => T
): StrictMap<EquipementSlot, T> {
  const y = (a: number) => a * LEN + 12;
  const xeven = (max: number) => W / 2 - (max / 2) * LEN;
  const xodd = (max: number) => W / 2 - LEN / 2 - Math.floor(max / 2) * LEN;
  const x = (a: number, max: number) =>
    a * LEN + (max % 2 === 0 ? xeven(max) : xodd(max)) + 2 * a;

  return {
    earring1: f(x(0, 3), y(0), 'earring'),
    head: f(x(1, 3), y(0), 'head'),
    earring2: f(x(2, 3), y(0), 'earring'),
    shoulders: f(x(0, 4), y(1), 'shoulders'),
    torso: f(x(1, 4), y(1), 'torso'),
    cape: f(x(2, 4), y(1), 'cape'),
    necklace: f(x(3, 4), y(1), 'necklace'),
    weapon: f(x(0, 5), y(2), 'weapon'),
    arms: f(x(1, 5), y(2), 'arms'),
    belt: f(x(2, 5), y(2), 'belt'),
    hands: f(x(3, 5), y(2), 'hands'),
    shield: f(x(4, 5), y(2), 'shield'),
    ring1: f(x(0, 4), y(3), 'ring'),
    legs: f(x(1, 4), y(3), 'legs'),
    feet: f(x(2, 4), y(3), 'feet'),
    ring2: f(x(3, 4), y(3), 'ring'),
  };
}
