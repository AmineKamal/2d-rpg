import { Sock } from './socket/dispatcher';
import { Engine } from './core/engine';
import { Players } from './actors/players/players';
import { Enemies } from './actors/ai/enemies/enemies';
import { State } from './state';
import { PlayerMovement } from './actors/players/player.movement';
import { SocketEvents } from './socket/events';

export async function main() {
  PlayerMovement.init();

  Sock.on.init(async (data) => {
    const g = Engine.get();
    console.log(data.enemies);
    await Enemies.get().populate(data.enemies);
    await Players.get().populate(data.users);
    await g.goto(data.map);
    await g.startEngine();
  });

  SocketEvents.init();
  Sock.emit.ai(State.get().map);
}
