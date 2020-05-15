import * as Tiled from './tiled';
import axios from 'axios';
import { Map } from 'simple-structures';
import { TileMap, TileSprite, Scene, Engine, Actor } from 'excalibur';
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
    const sheets = await this.getTileSheets(tiledmap.tilesets);
    const tilemap = this.initTileMap(tiledmap);

    sheets.forEach((s) => tilemap.registerSpriteSheet(s.id, s.sheet));
    const gids = sheets.map((s) => ({ id: s.id, gid: s.gid }));

    this.tilelayers(tiledmap.layers, tilemap, gids);
    const objects = await this.objectLayers(tiledmap.layers);

    this.maps[name] = this.initScene(g, tilemap);
    objects.forEach((o) => this.maps[name].add(o));

    return this.maps[name];
  }

  private async getJson(name: string) {
    const res = await axios.get<Tiled.TileMap>(this.path(name));
    return res.data;
  }

  private async getTileSheets(tilesets: Tiled.Tileset[]) {
    const filtered = tilesets.filter((ts) => ts.source[0] === 't');
    const sources = filtered.map((ts) => ts.source.split('.')[0]);
    const promises = sources.map((s) =>
      axios.get<Tiled.TileSheet>(this.path(s))
    );
    const tiledsheets = (await Promise.all(promises)).map((res) => res.data);

    const sheets = await Promise.all(
      tiledsheets.map((ts) => Resources().getSheet(ts))
    );

    return sheets.map((s, i) => ({ ...s, gid: filtered[i].firstgid }));
  }

  private path(name: string) {
    return `./assets/maps/${name}.json`;
  }

  private initTileMap(tiledMap: Tiled.TileMap) {
    const tw = tiledMap.tilewidth;
    const th = tiledMap.tileheight;
    const rows = tiledMap.height;
    const cols = tiledMap.width;

    return new TileMap(0, 0, tw, th, rows, cols);
  }

  private tilelayers(layers: Tiled.Layer[], tm: TileMap, gids: Gid[]) {
    const tl = layers.filter((l) => l.type === 'tilelayer');

    tl.forEach((l) =>
      l.data.forEach((d, i) => {
        if (d !== 0) {
          const { name, idx } = this.evaluateGids(d, gids);
          const ts = new TileSprite(name, idx);
          tm.getCellByIndex(i).pushSprite(ts);
        }
      })
    );
  }

  private evaluateGids(data: number, gids: Gid[]) {
    const sorted = gids.sort((a, b) => b.gid - a.gid);

    for (const gid of sorted) {
      if (data > gid.gid) {
        const idx = data - gid.gid;
        const name = gid.id;
        return { idx, name };
      }
    }
  }

  private async objectLayers(layers: Tiled.Layer[]) {
    const ol = layers.filter((l) => l.type === 'objectgroup');
    const obs = ol.find((l) => l.name === 'objects').objects;
    const cols = ol.find((l) => l.name === 'collisions').objects;
    const ps = ol.find((l) => l.name === 'portals').objects;

    const objects = await Promise.all(
      obs.map((o) => ObjectLoader.get().loadObject(o))
    );

    const collisions = await Promise.all(
      cols.map((c) => ObjectLoader.get().loadCollision(c))
    );

    const portals = await Promise.all(
      ps.map((p) => ObjectLoader.get().loadPortal(p))
    );

    return [...objects, ...collisions, ...portals];
  }

  private initScene(g: Engine, tm: TileMap) {
    const scene = new Scene(g);
    scene.addTileMap(tm);

    return scene;
  }
}
