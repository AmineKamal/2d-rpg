import {
  ILocation,
  EnemySprite,
  MapLocation,
  TaskType,
  IEnemy,
  CombatStat,
  IStat,
  AttackType,
  COMBAT_STATS,
  AIEnemy,
  CombatAttribute,
  COMBAT_ATTRIBUTES,
  IItem,
} from "../shared";
import * as uniqid from "uniqid";
import { StrictMap } from "simple-structures";
import { threat, Stat } from "../controllers/stats.manager";
import { GOLD } from "../data/items";

export class Enemy implements IEnemy {
  id: string;
  sprite: EnemySprite;
  name: string;
  location: ILocation;
  current: TaskType;
  #stats: StrictMap<CombatStat, Stat>;
  attackType: AttackType;
  attributes: StrictMap<CombatAttribute, number>;
  dead: boolean;
  loot: IItem[];

  public constructor(
    name: string,
    sp: EnemySprite,
    map: MapLocation,
    x: number,
    y: number,
    attackType: AttackType,
    stats: Partial<StrictMap<CombatStat, Stat>>
  ) {
    this.id = uniqid();
    this.sprite = sp;
    this.name = name;
    this.location = { map, pos: { x, y } };
    this.attackType = attackType;
    this.#stats = {} as StrictMap<CombatStat, Stat>;
    COMBAT_STATS.forEach((k) => (this.#stats[k] = stats[k] ?? new Stat()));
    this.attributes = {} as StrictMap<CombatAttribute, number>;

    COMBAT_ATTRIBUTES.forEach(
      (k) => (this.attributes[k] = this.#stats[k]?.points ?? 0)
    );

    this.dead = false;
    this.loot = [GOLD(10)];
  }

  public get threat() {
    return threat(this.#stats);
  }

  public get stats() {
    const stats = {} as StrictMap<CombatStat, IStat>;
    COMBAT_STATS.forEach((k) => (stats[k] = this.#stats[k].export()));

    return stats;
  }

  public get equipementBonus(): Partial<StrictMap<CombatStat, number>>[] {
    return [];
  }

  public export(): IEnemy {
    return {
      sprite: this.sprite,
      name: this.name,
      location: this.location,
      id: this.id,
      stats: this.stats,
      threat: this.threat,
      attributes: this.attributes,
      dead: this.dead,
    };
  }

  public track(track: AIEnemy) {
    this.current = track.current;
    this.location.pos.x = track.movement.pos.x;
    this.location.pos.y = track.movement.pos.y;
  }

  public receiveDamage(damage: number) {
    this.attributes.health -= damage;

    if (this.attributes.health <= 0) {
      this.attributes.health = 0;
      this.dead = true;
    }
  }
}
