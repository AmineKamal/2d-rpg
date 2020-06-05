import { IStat, CombatStat, AttackType } from "../shared";
import { StrictMap } from "simple-structures";

export type CalculatePoints = (level: number) => number;

export class Stat implements IStat {
  level: number;
  xp = 0;
  #calculatePoints: CalculatePoints;

  public constructor(calculate?: CalculatePoints, level?: number) {
    this.#calculatePoints = calculate ?? skill;
    this.level = level ?? 1;
  }

  export(): IStat {
    return {
      level: this.level,
      xp: this.xp,
      nextXp: this.nextXp,
      points: this.points,
    };
  }

  get nextXp() {
    return Math.pow(this.level, 3 / 2) * 100;
  }

  get points() {
    return this.#calculatePoints(this.level);
  }

  addXp(xp: number) {
    const next = this.nextXp;
    this.xp += xp;

    if (this.xp >= next) {
      this.level++;
      this.xp = this.xp - next;
    }
  }
}

export const physical = (l: number) => 100 * l;
export const skill = (l: number) => 2 * l;

export type AttackContrib = Partial<StrictMap<CombatStat, number>>;

export const slashContrib: AttackContrib = {
  slash: 50 as const,
  dexterity: 35 as const,
  strength: 15 as const,
} as const;

export const oversizeContrib: AttackContrib = {
  oversize: 50 as const,
  strength: 35 as const,
  dexterity: 15 as const,
} as const;

export const shootContrib: AttackContrib = {
  shoot: 50 as const,
  accuracy: 35 as const,
  dexterity: 15 as const,
} as const;

export const spellContrib: AttackContrib = {
  spell: 50 as const,
  intelligence: 50 as const,
} as const;

export const thrustContrib: AttackContrib = {
  thrust: 50 as const,
  dexterity: 30 as const,
  accuracy: 10 as const,
  strength: 10 as const,
} as const;

export function threat(stats: StrictMap<CombatStat, IStat>) {
  const lvls = (<const>["oversize", "slash", "thrust", "spell", "shoot"])
    .map((k) => stats[k].level)
    .sort();

  const coeffs = [5, 10, 15, 20, 50] as const;

  return Math.floor(
    coeffs.map((c, i) => c * lvls[i]).reduce((a, b) => a + b, 0) / 100
  );
}
