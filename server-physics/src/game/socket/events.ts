import { Sock } from './dispatcher';
import { Players } from '../actors/players/players';
import { Enemies } from '../actors/ai/enemies/enemies';

export class SocketEvents {
  private static initialized = false;

  public static init() {
    if (this.initialized) return;

    Sock.on.evaluateAttack(
      async (name) => Players.get().find(name)?.evaluateAttack() ?? []
    );

    Sock.on.attack(async (attack) => {
      console.log('ATTACK');
      const ids = attack.enemies.filter((e) => e.dead).map((e) => e.id);
      ids.forEach((id) => Enemies.get().find(id).tasks.dead());
    });

    this.initialized = true;
  }
}
