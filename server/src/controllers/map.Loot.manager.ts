import { StrictMap, Map } from "simple-structures";
import { MapLocation, IItem, IUpdateLoot } from "../shared";
import { LOOTS } from "../data/enemies.map";

export class MapLootManager {
  private static instance: MapLootManager;

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new MapLootManager();
    return this.instance;
  }

  private constructor() {}

  private loots: StrictMap<MapLocation, Map<IItem[]>> = LOOTS;

  public asArray(m: MapLocation): IUpdateLoot[] {
    const loot = this.loots[m];

    return Object.keys(loot).map((k) => ({ id: k, items: loot[k] }));
  }

  public get(map: MapLocation, id: string) {
    return this.loots[map][id];
  }

  public set(map: MapLocation, id: string, items: IItem[]) {
    this.loots[map][id] = [...items];
  }

  public check(map: MapLocation, id: string, items: IItem[]) {
    return items.filter((i) =>
      this.loots[map][id].find((it) => it.name === i.name)
    );
  }

  public remove(map: MapLocation, id: string, items: IItem[]) {
    this.loots[map][id] = this.loots[map][id].filter(
      (i) => !items.find((it) => it.name === i.name)
    );
  }
}
