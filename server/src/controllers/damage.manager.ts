import { StrictMap } from "simple-structures";
import { CombatStat, AttackType, IStat } from "../shared";
import {
  oversizeContrib,
  shootContrib,
  slashContrib,
  spellContrib,
  thrustContrib,
} from "./stats.manager";

export class DamageManager {
  private static instance: DamageManager;

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new DamageManager();
    return this.instance;
  }

  private constructor() {}

  calculateDamage(
    type: AttackType,
    atkStats: StrictMap<CombatStat, IStat>,
    defStats: StrictMap<CombatStat, IStat>,
    atkBonus?: Partial<StrictMap<CombatStat, number>>[],
    defBonus?: Partial<StrictMap<CombatStat, number>>[]
  ) {
    const atkB = atkBonus ?? [];
    const defB = defBonus ?? [];

    const contrib = this.getContrib(type);
    const keys: CombatStat[] = Object.keys(contrib) as CombatStat[];

    let damage = 0;

    keys.forEach((k) => (damage += atkStats[k].points * (contrib[k] / 100)));

    atkB.forEach((b) =>
      keys.forEach((k) => (damage += (b[k] ?? 0) * (contrib[k] / 100)))
    );

    damage -= defStats.defense.points;
    defB.forEach((b) => (damage -= b.defense ?? 0));

    return damage;
  }

  getContrib(attackType: AttackType) {
    switch (attackType) {
      case "oversize":
        return oversizeContrib;
      case "shoot":
        return shootContrib;
      case "slash":
        return slashContrib;
      case "spell":
        return spellContrib;
      case "thrust":
        return thrustContrib;
    }
  }
}
