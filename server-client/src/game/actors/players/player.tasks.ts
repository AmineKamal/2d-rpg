import { Player } from './player';
import { SLASH_MAP, IDLE_MAP, SPELL_MAP } from '../../core/animation.maps';
import { LeftJoystick } from '../../core/leftJoystick';
import { PlayableAnimations, Direction } from '../../shared';
import { StrictMap } from 'simple-structures';

export class PlayerTasks {
  private player: Player;
  private locked: boolean;

  public constructor(player: Player) {
    this.player = player;
    this.locked = false;
  }

  public slash() {
    this.set(SLASH_MAP, 6);
  }

  public spell() {
    this.set(SPELL_MAP, 7);
  }

  private set(map: StrictMap<Direction, PlayableAnimations>, frames: number) {
    if (this.locked) return;
    this.lock();

    setTimeout(() => this.unlock(), frames * 100);
  }

  private lock() {
    this.locked = true;
    LeftJoystick.get().lock(true);
  }

  private unlock() {
    this.locked = false;
    LeftJoystick.get().unlock();
  }
}
