import { StrictMap } from "simple-structures";

export const MAPS = ["m1", "m2"] as const;
export type MapLocation = typeof MAPS[number];

export interface ILocation {
  pos: { x: number; y: number };
  map: MapLocation;
}

export interface ICreateAccount {
  username: string;
  password: string;
  dna: IUserDNA;
}

export type UserSprite = "c1";
export type EnemySprite = "e1";
export type ClientEvent =
  | "move"
  | "teleport"
  | "track"
  | "create"
  | "ai"
  | "equip"
  | "attack"
  | "loot";

export type ServerEvent =
  | "move"
  | "init"
  | "joined"
  | "left"
  | "track"
  | "equip"
  | "attack"
  | "evaluateAttack"
  | "loot";

export type SocketOnAction<I, O> = (f: (data: I) => Promise<O>) => void;
export type SocketEmitAction<I, O> = (data: I) => Promise<O>;

export type AttackType = "slash" | "thrust" | "spell" | "oversize" | "shoot";

export interface IEnemyAttacked {
  id: string;
  dead: boolean;
  damage: number;
  attributes: StrictMap<CombatAttribute, number>;
  loot: IItem[];
}

export interface IUserAttack {
  name: string;
  enemies: IEnemyAttacked[];
}

export interface IUpdateLoot {
  id: string;
  items: IItem[];
}

export const COMBAT_ATTRIBUTES = ["health", "stamina", "mana"] as const;
export type CombatAttribute = typeof COMBAT_ATTRIBUTES[number];

export const LIFE_ATTRIBUTES = ["hunger", "exhaustion", "age"] as const;
export type LifeAttribute = typeof LIFE_ATTRIBUTES[number];

export type UserAttribute = LifeAttribute | CombatAttribute;

export const COMBAT_STATS = [
  "health",
  "stamina",
  "mana",
  "agility",
  "defense",
  "accuracy",
  "strength",
  "intelligence",
  "dexterity",
  "sneak",
  "awareness",
  "slash",
  "thrust",
  "spell",
  "oversize",
  "shoot",
] as const;
export type CombatStat = typeof COMBAT_STATS[number];

export const GATHERING_STATS = [
  "woodcutting",
  "mining",
  "fishing",
  "farming",
] as const;
export type GatheringStat = typeof GATHERING_STATS[number];

export const ARTISAN_STATS = [
  "cooking",
  "crafting",
  "enchanting",
  "alchemy",
] as const;
export type ArtisanStat = typeof ARTISAN_STATS[number];

export const SUPPORT_STATS = ["thieving"] as const;
export type SupportStat = typeof SUPPORT_STATS[number];

export const USER_STATS = [
  ...COMBAT_STATS,
  ...GATHERING_STATS,
  ...ARTISAN_STATS,
  ...SUPPORT_STATS,
] as const;

export type UserStat = typeof USER_STATS[number];

export interface IStat {
  level: number;
  xp: number;
  nextXp: number;
  points: number;
}

const ITEM_TYPES = ["WEARABLE", "USEABLE", "CONSUMABLE"] as const;
type ItemType = typeof ITEM_TYPES[number];

export interface IEquipItem {
  name: string;
  equipement: Partial<IUserEquipement>;
  inventory?: IItem[];
}

export interface IItem {
  name: string;
  sprite: string;
  quantity: number;
  type: ItemType;
  sex?: "male" | "female";
  bonus?: Partial<StrictMap<UserStat, number>>;
  duration?: number;
  activateJob?: GatheringStat | ArtisanStat;
  equipSlot?: EquipementSlot;
  equipSprite?: string;
  attackType?: AttackType;
  equipAll?: boolean;
}

export const EQUIPEMENT_SLOTS = [
  "quiver",
  "earring1",
  "head",
  "earring2",
  "shoulders",
  "torso",
  "cape",
  "necklace",
  "weapon",
  "arms",
  "belt",
  "hands",
  "shield",
  "ring1",
  "legs",
  "feet",
  "ring2",
] as const;

export type EquipementSlot = typeof EQUIPEMENT_SLOTS[number];

export class IUserEquipement implements StrictMap<EquipementSlot, any> {
  quiver: IItem;
  feet: IItem;
  legs: IItem;
  belt: IItem;
  torso: IItem;
  shoulders: IItem;
  arms: IItem;
  hands: IItem;
  cape: IItem;
  head: IItem;
  weapon: IItem;
  shield: IItem;
  ring1: IItem;
  ring2: IItem;
  necklace: IItem;
  earring1: IItem;
  earring2: IItem;
}

export interface IUserDNA {
  sex: "female" | "male";
  skin:
    | "white"
    | "black"
    | "olive"
    | "brown"
    | "peach"
    | "dark"
    | "dark2"
    | "tan1"
    | "tan2";

  eyes:
    | "blue"
    | "brown"
    | "gray"
    | "green"
    | "purple"
    | "red"
    | "yellow"
    | "orange";

  facialHair: string;
  hair: string;
  hairColor: string;
  nose: string;
  ears: string;
}

export interface IUser {
  dna: IUserDNA;
  location: ILocation;
  sprite: UserSprite;
  name: string;
  stats: StrictMap<UserStat, IStat>;
  attributes: StrictMap<UserAttribute, number>;
  threat: number;
  inventory: IItem[];
  equipement: Partial<IUserEquipement>;
}

export interface IEnemy {
  id: string;
  location: ILocation;
  sprite: EnemySprite;
  name: string;
  stats: StrictMap<CombatStat, IStat>;
  attributes: StrictMap<CombatAttribute, number>;
  threat: number;
  tracked?: boolean;
  dead: boolean;
}

export const TASKS = ["routine", "follow", "dead"] as const;
export type TaskType = typeof TASKS[number];

export interface TrackAI {
  map: MapLocation;
  enemies: AIEnemy[];
}

export interface AIEnemy {
  id: string;
  movement: AIMovement;
  current: TaskType;
}

export interface AIMovement {
  velx: number;
  vely: number;
  dir: Direction;
  anim: PlayerAnimation;
  pos: { x: number; y: number };
}

export interface InitGame {
  map: MapLocation;
  users: IUser[];
  enemies: IEnemy[];
  loots: IUpdateLoot[];
}

export interface IPlayerMovement {
  name: string;
  dir: Direction | "end";
  speed?: number;
  pos?: { x: number; y: number };
}

export const DIRECTIONS = ["up", "down", "left", "right"] as const;
export type Dir = typeof DIRECTIONS[number];
export type Direction = number;

export const TO_DIR = (n: Direction): Dir => {
  if (n < 0) return "down";
  else if (n < 75) return "right";
  else if (n <= 105) return "up";
  else if (n < 255) return "left";
  else if (n <= 285) return "down";
  else return "right";
};

export const MOVE_DIRECTIONS = ["m_up", "m_down", "m_left", "m_right"] as const;
export type MoveDirection = typeof MOVE_DIRECTIONS[number];

export const IDLE_DIRECTIONS = ["i_up", "i_down", "i_left", "i_right"] as const;
export type IdleDirection = typeof IDLE_DIRECTIONS[number];

export const SLASH_DIRECTIONS = [
  "sl_up",
  "sl_down",
  "sl_left",
  "sl_right",
] as const;
export type SlashDirection = typeof SLASH_DIRECTIONS[number];

export const THRUST_DIRECTIONS = [
  "t_up",
  "t_down",
  "t_left",
  "t_right",
] as const;
export type ThrustDirection = typeof THRUST_DIRECTIONS[number];

export const SPELL_DIRECTIONS = [
  "sp_up",
  "sp_down",
  "sp_left",
  "sp_right",
] as const;
export type SpellDirection = typeof SPELL_DIRECTIONS[number];

export const SHOOT_DIRECTIONS = [
  "sh_up",
  "sh_down",
  "sh_left",
  "sh_right",
] as const;
export type ShootDirection = typeof SHOOT_DIRECTIONS[number];

export const OVERSIZE_DIRECTIONS = [
  "ov_up",
  "ov_down",
  "ov_left",
  "ov_right",
] as const;
export type OversizeDirection = typeof OVERSIZE_DIRECTIONS[number];

export const DEAD = ["dead"] as const;
export type Dead = typeof DEAD[number];

export type PlayableAnimations =
  | SlashDirection
  | ThrustDirection
  | SpellDirection
  | ShootDirection
  | OversizeDirection
  | Dead;

export type PlayerAnimation =
  | PlayableAnimations
  | IdleDirection
  | MoveDirection;
