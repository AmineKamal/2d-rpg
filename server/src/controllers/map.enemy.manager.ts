import { Enemy } from "../classes/enemy";
import { StrictMap } from "simple-structures";
import { MapLocation, IEnemy, TrackAI, IEnemyAttacked } from "../shared";
import { ENEMIES } from "../data/enemies.map";
import { User } from "../classes/user";
import { DamageManager } from "./damage.manager";
import { MapLootManager } from "./map.loot.manager";

export class MapEnemyManager {
  private enemies: StrictMap<MapLocation, Enemy[]> = ENEMIES;

  public track(track: TrackAI) {
    track.enemies.forEach((t) => {
      const enemy = this.enemies[track.map].find((e) => e.id === t.id);
      if (enemy) enemy.track(t);
    });
  }

  public userAttack(
    user: User,
    ids: string[],
    m: MapLocation
  ): IEnemyAttacked[] {
    const enemies = this.enemies[m].filter(
      (e) => !e.dead && ids.includes(e.id)
    );

    if (enemies.length <= 0) return [];

    return enemies.map((e) => this.calculateUserAttack(user, e, m));
  }

  public get(map: MapLocation) {
    return this.pick(this.enemies[map]);
  }

  public pick(enemies: Enemy[]): IEnemy[] {
    return enemies.map((e) => e.export());
  }

  private calculateUserAttack(
    user: User,
    enemy: Enemy,
    m: MapLocation
  ): IEnemyAttacked {
    const damage =
      DamageManager.get().calculateDamage(
        user.attackType,
        user.stats,
        enemy.stats,
        user.equipementBonus,
        enemy.equipementBonus
      ) + 10;

    enemy.receiveDamage(damage);

    if (enemy.dead) MapLootManager.get().set(m, enemy.id, enemy.loot);

    return {
      id: enemy.id,
      damage,
      attributes: enemy.attributes,
      dead: enemy.dead,
      loot: enemy.dead ? enemy.loot : [],
    };
  }
}
