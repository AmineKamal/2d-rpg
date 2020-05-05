import * as Tiled from './tiled';
import axios from 'axios';
import { Map } from 'simple-structures';
import { TileMap, TileSprite, Scene, Engine } from 'excalibur';
import { Resources } from './resources';
import { ObjectLoader } from './object';

interface Gid {
  id: string;
  gid: number;
}

export class MapLoader {
  private constructor() {}
  private static instance: MapLoader;

  private maps: Map<Scene> = {};

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new MapLoader();
    return this.instance;
  }

  public async load(g: Engine, name: string) {
    if (this.maps[name]) return this.maps[name];

    const tiledmap = await this.getJson(name);
    const objects = await this.objectLayers(tiledmap.layers);

    this.maps[name] = this.initScene(g);
    objects.forEach((o) => this.maps[name].add(o));

    return this.maps[name];
  }

  private async getJson(name: string) {
    const res = await axios.get<Tiled.TileMap>(this.path(name));
    return res.data;
  }

  private path(name: string) {
    return `./assets/maps/${name}.json`;
  }

  private async objectLayers(layers: Tiled.Layer[]) {
    const ol = layers.filter((l) => l.type === 'objectgroup');

    const cols = ol.find((l) => l.name === 'collisions').objects;

    const collisions = await Promise.all(
      cols.map((c) => ObjectLoader.get().loadCollision(c))
    );

    return [...collisions];
  }

  private initScene(g: Engine) {
    const scene = new Scene(g);

    return scene;
  }
}
