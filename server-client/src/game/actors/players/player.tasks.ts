import { Player } from './player';

export class PlayerTasks {
  private player: Player;
  private locked: boolean;

  public constructor(player: Player) {
    this.player = player;
    this.locked = false;
  }

  public slash() {
    this.set(6);
  }

  public spell() {
    this.set(7);
  }

  private set(frames: number) {
    if (this.locked) return;
    this.lock();

    setTimeout(() => this.unlock(), frames * 100);
  }

  private lock() {
    this.locked = true;
  }

  private unlock() {
    this.locked = false;
  }
}
