import { Sock } from './dispatcher';
import { Players } from '../ui/actors/players/players';
import { Enemies } from '../ui/actors/ai/enemies/enemies';
import { State } from '../data/state';

export class SocketEvents {
  private static initialized = false;

  public static init() {
    if (this.initialized) return;

    Sock.on.equip((equip) => Players.get().equip(equip));

    Sock.on.attack(async (player) => {
      Players.get().find(player.name).tasks.attack();
      player.enemies.forEach((e) => Enemies.get().find(e.id).receiveAttack(e));
    });

    Sock.on.loot(async (loot) => {
      State.get().loot.update(loot.id, loot.items);
    });

    this.initialized = true;
  }
}
