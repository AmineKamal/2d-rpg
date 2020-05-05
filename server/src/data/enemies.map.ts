import { Enemy } from "../classes/enemy";
import { StrictMap, Map } from "simple-structures";
import { MapLocation, IItem } from "../shared";
import { Goblin } from "./enemies";

const m1: Enemy[] = [
  Goblin("m1", 320, 320).slash(1),
  Goblin("m1", 150, 320).slash(1),
];

const m2: Enemy[] = [
  Goblin("m2", 320, 320).slash(1),
  Goblin("m2", 150, 320).slash(1),
];

export const ENEMIES: StrictMap<MapLocation, Enemy[]> = {
  m1,
  m2,
};

export const LOOTS: StrictMap<MapLocation, Map<IItem[]>> = {
  m1: {},
  m2: {},
};
