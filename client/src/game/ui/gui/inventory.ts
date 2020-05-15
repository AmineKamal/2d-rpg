import { ScreenElement, Color, Texture, Label } from 'excalibur';
import { Resources } from '../../core/resources';
import { State } from '../../data/state';
import { IItem } from '../../shared';
import { Sock } from 'src/game/socket/dispatcher';
import { Observable } from 'simple-structures';
import { Clickable } from './clickable';

const COLS = 8;
const ROWS = 4;
const LEN = 64;
const W = 546;
const H = 286;

export class Inventory<T extends InventorySlot> extends ScreenElement {
  private static instance: Inventory<InventorySlot>;

  private slots: T[];

  public constructor(
    inv: Texture,
    slot: Texture,
    I: new (r: number, c: number, tex: Texture) => T,
    ob: Observable<IItem[]>
  ) {
    super(window.innerWidth / 2 - 273, window.innerHeight / 2 - 130, W, H);
    this.addDrawing(inv);
    this.visible = false;
    this.slots = marr(ROWS, COLS, (r, c) => new I(r, c, slot));
    this.slots.forEach((s) => this.add(s));
    this.subscribe(ob);
  }

  public static async create() {
    if (this.instance) return this.instance;

    const slot = await Resources().get('./assets/gui/inventory-slot.png');
    const inv = await Resources().get('./assets/gui/inventory.png');
    const ob = State.get().player._inventory;

    this.instance = new Inventory(inv, slot, InventorySlot, ob);

    return this.instance;
  }

  public static get() {
    if (this.instance) return this.instance;
  }

  public static toggle() {
    const inventory = this.get();
    if (inventory) inventory.visible = !inventory.visible;
  }

  public static hide() {
    const inventory = this.get();
    if (inventory) inventory.visible = false;
  }

  private subscribe(ob: Observable<IItem[]>) {
    ob.subscribe((items) => {
      this.slots.forEach((s, i) => s.updateItem(items[i]));
    });
  }
}

export class InventorySlot extends Clickable {
  protected item: IItem;
  private qty: Label;
  private itemActor: ScreenElement;
  private drawings: string[] = [];

  public constructor(r: number, c: number, tex: Texture) {
    super(LEN * c + 17, LEN * r + 16, LEN, LEN);
    this.addDrawing(tex);
    this.itemActor = new ScreenElement(LEN / 4, LEN / 4);
    this.itemActor.visible = false;
    this.qty = new Label('', 60, 64);
    this.qty.color = Color.White;
    this.add(this.qty);
    this.add(this.itemActor);
  }

  async updateItem(item?: IItem) {
    if (!item) return this.removeItem();
    if (this.item?.name === item.name) return this.updateQty(item.quantity);

    if (!this.drawings.includes(item.name)) {
      const sp = (await Resources().query(item.sprite)).asSprite();
      this.itemActor.addDrawing(item.name, sp);
      this.drawings.push(item.name);
    }

    this.itemActor.setDrawing(item.name);
    this.itemActor.visible = true;
    this.updateQty(item.quantity);
    this.item = item;
  }

  updateQty(qty: number) {
    if (this.item?.quantity === qty) return;
    const qt = qty.toFixed(0);
    this.qty.text = qt;
    this.qty.pos.x = 60 - 5.5 * qt.length;
    this.qty.visible = qty > 1;
  }

  removeItem() {
    this.item = undefined;
    this.itemActor.visible = false;
    this.qty.visible = false;
  }

  protected cl() {}

  protected dbl() {
    Sock.emit.equip(this.item);
  }

  protected conditon() {
    return !!this.item;
  }
}

function marr<T>(r: number, c: number, f: (r: number, c: number) => T): T[] {
  const arr: T[] = [];
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      arr.push(f(i, j));
    }
  }

  return arr;
}
