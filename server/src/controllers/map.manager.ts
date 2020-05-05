import { MapUserManager } from "./mapUser.manager";
import { MapEnemyManager } from "./mapEnemy.manager";

export class MapManager {
  private static instance: MapManager;

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new MapManager();
    return this.instance;
  }

  private constructor() {
    this.enemies = new MapEnemyManager();
    this.users = new MapUserManager(this.enemies);
  }

  public users: MapUserManager;
  public enemies: MapEnemyManager;
}
