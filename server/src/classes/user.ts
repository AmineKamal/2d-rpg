import {
  ILocation,
  UserSprite,
  IUser,
  UserStat,
  USER_STATS,
  IStat,
  IItem,
  IUserEquipement,
  IUserDNA,
  UserAttribute,
  EQUIPEMENT_SLOTS,
  CombatStat,
} from "../shared";
import {
  INITIAL_LOCATION,
  INITIAL_STATS,
  INITIAL_ATTRIBUTES,
} from "../data/init.user";
import { SocketDispatcher } from "../socket/dispatcher";
import { clone, StrictMap } from "simple-structures";
import { Stat, threat } from "../controllers/stats.manager";
import { GOLD, LONG_SLEEVE_SHIRT_M_BLACK } from "../data/items";
import { Inventory } from "./inventory";

export class User implements IUser {
  id: string;
  sprite: UserSprite;
  name: string;
  location: ILocation;
  connected: boolean;
  s: SocketDispatcher;
  inv: Inventory;
  equipement: Partial<IUserEquipement>;
  dna: IUserDNA;
  #stats: StrictMap<UserStat, Stat>;
  attributes: StrictMap<UserAttribute, number>;

  public constructor(
    name: string,
    sprite: UserSprite,
    dna: IUserDNA,
    s: SocketDispatcher
  ) {
    this.s = s;
    this.id = s.id;
    this.sprite = sprite;
    this.name = name;
    this.connected = true;
    this.location = clone(INITIAL_LOCATION);
    this.#stats = INITIAL_STATS();
    this.attributes = INITIAL_ATTRIBUTES(this.#stats);
    this.inv = new Inventory(32, [LONG_SLEEVE_SHIRT_M_BLACK(1), GOLD(100)]);
    this.equipement = {};
    this.dna = dna;
  }

  public get threat() {
    return threat(this.#stats);
  }

  public export(): IUser {
    return {
      sprite: this.sprite,
      name: this.name,
      location: this.location,
      stats: this.stats,
      threat: this.threat,
      equipement: this.equipement,
      inventory: this.inventory,
      dna: this.dna,
      attributes: this.attributes,
    };
  }

  public get stats() {
    const stats = {} as StrictMap<UserStat, IStat>;
    USER_STATS.forEach((k) => (stats[k] = this.#stats[k].export()));

    return stats;
  }

  public get inventory() {
    return this.inv.export();
  }

  public get equipementBonus(): Partial<StrictMap<CombatStat, number>>[] {
    const bonus: Partial<StrictMap<CombatStat, number>>[] = [];

    EQUIPEMENT_SLOTS.forEach((s) => {
      if (this.equipement[s]?.bonus) bonus.push(this.equipement[s].bonus);
    });

    return bonus;
  }

  public get attackType() {
    return this.equipement.weapon?.attackType ?? "slash";
  }
}
