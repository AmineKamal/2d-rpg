import { UserStat, IStat } from '../../shared';
import { StrictMap } from 'simple-structures';

export class PlayerStats implements StrictMap<UserStat, IStat> {
  health: IStat;
  stamina: IStat;
  mana: IStat;
  agility: IStat;
  accuracy: IStat;
  defense: IStat;
  strength: IStat;
  intelligence: IStat;
  dexterity: IStat;
  sneak: IStat;
  awareness: IStat;
  slash: IStat;
  thrust: IStat;
  spell: IStat;
  oversize: IStat;
  shoot: IStat;
  woodcutting: IStat;
  mining: IStat;
  fishing: IStat;
  farming: IStat;
  cooking: IStat;
  crafting: IStat;
  enchanting: IStat;
  alchemy: IStat;
  thieving: IStat;

  public get speed() {
    return Math.floor((this.agility?.points ?? 0) * 0.5 + 80);
  }
}
