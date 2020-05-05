import {
  UserSprite,
  IUser,
  ILocation,
  UserStat,
  IStat,
  IItem,
  IUserEquipement,
  IUserDNA,
  EquipementSlot,
  UserAttribute,
} from '../../shared';
import { PlayerStats } from './player.stats';
import { clone, Observable, StrictMap } from 'simple-structures';

export class PlayerState implements IUser {
  public name: string;
  public sprite: UserSprite;
  public dna: IUserDNA;
  public _stats: Observable<PlayerStats>;
  public threat: number;
  public location: ILocation;
  public _inventory: Observable<IItem[]>;
  public _equipement: Observable<Partial<IUserEquipement>>;
  public _attributes: Observable<StrictMap<UserAttribute, number>>;

  public constructor() {
    this.name = '';
    this.sprite = 'c1';
    this._stats = new Observable(new PlayerStats());
    this._inventory = new Observable([]);
    this._equipement = new Observable({});
    this._attributes = new Observable();
  }

  public get equipement() {
    return this._equipement.value;
  }

  public get inventory() {
    return this._inventory.value;
  }

  public get stats() {
    return this._stats.value;
  }

  public get attributes() {
    return this._attributes.value;
  }

  public update(user: Partial<IUser>) {
    if (user.name) this.name = user.name;
    if (user.inventory) this.updateInventory(user.inventory);
    if (user.equipement) this.updateEquipement(user.equipement);
    if (user.location) this.setLocation(user.location);
    if (user.stats) this.updateStats(user.stats);
    if (user.threat) this.setThreat(user.threat);
    if (user.dna) this.setDna(user.dna);
    if (user.attributes) this.setAttributes(user.attributes);
  }

  private updateInventory(items: IItem[]) {
    this._inventory.replace(items);
  }

  private updateStats(stats: Partial<StrictMap<UserStat, IStat>>) {
    this._stats.update((st) => {
      Object.keys(stats).forEach((k: UserStat) => (st[k] = stats[k]));
    });
  }

  private updateEquipement(equip: Partial<IUserEquipement>) {
    this._equipement.update((e) => {
      Object.keys(equip).forEach((k: EquipementSlot) => (e[k] = equip[k]));
    });
  }

  private setAttributes(attributes: StrictMap<UserAttribute, number>) {
    this._attributes.replace(attributes);
  }

  private setLocation(loc: ILocation) {
    this.location = clone(loc);
  }

  private setThreat(th: number) {
    this.threat = th;
  }

  private setDna(dna: IUserDNA) {
    this.dna = dna;
  }
}
