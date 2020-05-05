import { UserStat, UserAttribute } from "../shared";
import { ILocation } from "../shared";
import { StrictMap } from "simple-structures";
import { Stat, physical, skill } from "../controllers/stats.manager";

export const INITIAL_LOCATION: ILocation = {
  map: "m1" as const,
  pos: { x: 303 as const, y: 557 as const } as const,
} as const;

export const INITIAL_STATS: () => StrictMap<UserStat, Stat> = () => {
  return {
    health: new Stat(physical),
    stamina: new Stat(physical),
    mana: new Stat(physical),
    agility: new Stat(skill),
    accuracy: new Stat(skill),
    defense: new Stat(skill),
    strength: new Stat(skill),
    intelligence: new Stat(skill),
    dexterity: new Stat(skill),
    sneak: new Stat(skill),
    awareness: new Stat(skill),
    slash: new Stat(skill),
    thrust: new Stat(skill),
    spell: new Stat(skill),
    oversize: new Stat(skill),
    shoot: new Stat(skill),
    woodcutting: new Stat(skill),
    mining: new Stat(skill),
    fishing: new Stat(skill),
    farming: new Stat(skill),
    cooking: new Stat(skill),
    crafting: new Stat(skill),
    enchanting: new Stat(skill),
    alchemy: new Stat(skill),
    thieving: new Stat(skill),
  };
};

type InitialAttribute = (
  s: StrictMap<UserStat, Stat>
) => StrictMap<UserAttribute, number>;

export const INITIAL_ATTRIBUTES: InitialAttribute = (
  s: StrictMap<UserStat, Stat>
) => {
  return {
    health: s.health.points,
    mana: s.mana.points,
    stamina: s.stamina.points,
    age: 1,
    hunger: 0,
    exhaustion: 0,
  };
};
