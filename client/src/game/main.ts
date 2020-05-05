import { State } from './data/state';
import { Bar } from './ui/gui/statusbar';
import { Sock } from './socket/dispatcher';
import { Engine } from './core/engine';
import { Players } from './ui/actors/players/players';
import { startInteraction } from './ui/gui/interaction';
import { Enemies } from './ui/actors/ai/enemies/enemies';
import { Actions } from './core/actions';
import { LeftJoystick } from './core/leftJoystick';
import { Fonts } from './core/fonts';
import { Inventory } from './ui/gui/inventory';
import { Equipement } from './ui/gui/equipement';
import { IUserDNA } from './shared';
import { SocketEvents } from './socket/events';
import { Loot } from './ui/gui/loot';
import { Clickable } from './ui/gui/clickable';

export async function main(name: string, password: string, dna: IUserDNA) {
  startInteraction();
  Bar.init('hp', 'sp', 'mp');
  Clickable.init();

  // Actions.get().attack(() => Players.get().self.tasks.attack());
  Actions.get().attack(() => Sock.emit.attack());
  Actions.get().skill(() => Players.get().self.tasks.spell());

  Sock.on.init(async (data) => {
    console.log(data);
    await Fonts.load();
    await Equipement.create();
    await Inventory.create();
    await Loot.create();

    const g = Engine.get();
    State.get().loot.updateMany(data.loots);
    await Enemies.get().populate(data.enemies);
    await Players.get().populate(data.users);
    await g.goto(State.get().player.location.map);
    await g.startEngine();
    LeftJoystick.get().unlock();
    Actions.get().unlock();
  });

  SocketEvents.init();

  State.get().player.update({ name });
  Sock.emit.create({
    username: name,
    password,
    dna,
  });
}
