import { Enemy } from "../classes/enemy";
import { MapLocation, AttackType, CombatStat } from "../shared";
import {
  AttackContrib,
  oversizeContrib,
  shootContrib,
  slashContrib,
  spellContrib,
  thrustContrib,
  Stat,
  skill,
  physical,
} from "../controllers/stats.manager";
import { StrictMap } from "simple-structures";

const Level = (contrib: AttackContrib, lvl: number, speedReducer: number) => {
  const constant = lvl * 4; // TODO Update to be exponential

  const stats = Object.keys(contrib).reduce((a, k: CombatStat) => {
    a[k] = new Stat(skill, Math.floor((contrib[k] * constant) / 100));
    return a;
  }, {} as Partial<StrictMap<CombatStat, Stat>>);

  stats.health = new Stat(physical, lvl);
  stats.agility = new Stat(skill, Math.floor(lvl / speedReducer));
  return stats;
};

const Attack = (type: AttackType, lvl: number) => {
  switch (type) {
    case "oversize":
      return Level(oversizeContrib, lvl, 5);
    case "shoot":
      return Level(shootContrib, lvl, 3);
    case "slash":
      return Level(slashContrib, lvl, 3);
    case "spell":
      return Level(spellContrib, lvl, 3);
    case "thrust":
      return Level(thrustContrib, lvl, 3);
  }
};

function makeEnemy(
  create: (
    stats: Partial<StrictMap<CombatStat, Stat>>,
    type: AttackType
  ) => Enemy
) {
  return {
    oversize: (lvl: number) => create(Attack("oversize", lvl), "oversize"),
    shoot: (lvl: number) => create(Attack("shoot", lvl), "shoot"),
    slash: (lvl: number) => create(Attack("slash", lvl), "slash"),
    spell: (lvl: number) => create(Attack("spell", lvl), "spell"),
    thrust: (lvl: number) => create(Attack("thrust", lvl), "thrust"),
  };
}

export function Goblin(m: MapLocation, x: number, y: number) {
  const create = (
    stats: Partial<StrictMap<CombatStat, Stat>>,
    type: AttackType
  ) => new Enemy("Goblin", "e1", m, x, y, type, stats);
  return makeEnemy(create);
}
