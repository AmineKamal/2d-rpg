import { Player } from './player';
import {
  SLASH_MAP,
  IDLE_MAP,
  SPELL_MAP,
  THRUST_MAP,
  SHOOT_MAP,
  OVERSIZE_MAP,
} from '../../../core/animation.maps';
import { LeftJoystick } from '../../../core/leftJoystick';
import { PlayableAnimations, Direction } from '../../../shared';
import { StrictMap } from 'simple-structures';
import { Actions } from '../../../core/actions';

export class PlayerTasks {
  private player: Player;
  private locked: boolean;

  public constructor(player: Player) {
    this.player = player;
    this.locked = false;
  }

  public attack() {
    switch (this.player.equipement.weapon?.attackType) {
      case 'oversize':
        return this.oversize();
      case 'shoot':
        return this.shoot();
      case 'thrust':
        return this.thrust();
      case 'spell':
        return this.spell();
      default:
        return this.slash();
    }
  }

  public oversize() {
    this.set(OVERSIZE_MAP, 6);
  }

  public shoot() {
    this.set(SHOOT_MAP, 13);
  }

  public slash() {
    this.set(SLASH_MAP, 6);
  }

  public thrust() {
    this.set(THRUST_MAP, 7);
  }

  public spell() {
    this.set(SPELL_MAP, 7);
  }

  private set(map: StrictMap<Direction, PlayableAnimations>, frames: number) {
    if (this.locked) return;
    this.player.setAnimation(map[this.player.dir], true);
    this.lock();

    setTimeout(() => {
      this.unlock();
      this.player.setAnimation(IDLE_MAP[this.player.dir]);
    }, frames * 75);
  }

  private lock() {
    this.locked = true;
    this.player.lockAnimation();
    LeftJoystick.get().lock(true);
    Actions.get().lock();
  }

  private unlock() {
    this.locked = false;
    this.player.unlockAnimation();
    LeftJoystick.get().unlock();
    Actions.get().unlock();
  }
}
