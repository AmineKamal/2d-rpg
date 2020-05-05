import { InteractionState } from './classes/interaction.state';
import { PlayerState } from './classes/player.state';
import { LootState } from './classes/loot.state';

export class State {
  private constructor() {}
  private static instance?: State;

  public interaction: InteractionState = new InteractionState();
  public player: PlayerState = new PlayerState();
  public loot: LootState = new LootState();

  public static get() {
    if (this.instance) return this.instance;
    this.instance = new State();

    return this.instance;
  }
}
