import { InventorySlot, Inventory } from './inventory';
import { Resources } from 'src/game/core/resources';
import { State } from 'src/game/data/state';
import { Sock } from 'src/game/socket/dispatcher';

export class Loot {
  private static instance: Inventory<LootSlot>;

  public static async create() {
    if (this.instance) return this.instance;

    console.log('LOOT');
    const slot = await Resources().get('./assets/gui/inventory-slot.png');
    const inv = await Resources().get('./assets/gui/inventory.png');
    const ob = State.get().loot.current;
    this.instance = new Inventory<LootSlot>(inv, slot, LootSlot, ob);

    return this.instance;
  }

  public static get() {
    if (this.instance) return this.instance;
  }

  public static toggle() {
    const loot = this.get();
    if (loot) loot.visible = !loot.visible;
  }

  public static hide() {
    const loot = this.get();
    if (loot) loot.visible = false;
  }

  public static show() {
    const loot = this.get();
    if (loot) loot.visible = true;
  }
}

class LootSlot extends InventorySlot {
  protected async dbl() {
    const id = State.get().loot.currentId;
    const items = [this.item];
    const user = await Sock.emit.loot({ id, items });
    State.get().player.update(user);
  }
}
