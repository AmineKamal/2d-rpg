import { MapUserManager } from "./map.user.manager";
import { MapEnemyManager } from "./map.enemy.manager";
import { StrictMap } from "simple-structures";
import { MapLocation } from "../shared";

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
