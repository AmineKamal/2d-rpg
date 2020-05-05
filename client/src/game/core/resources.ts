import { Texture, SpriteSheet } from 'excalibur';
import { Map, VolatileMap } from 'simple-structures';
import * as Tiled from './tiled';

export class ResourceLoader {
  private constructor() {}
  private static instance: ResourceLoader;

  // Permanent caching stays during whole duration of game
  private textures: Map<Texture> = {};
  private sheets: Map<SpriteSheet> = {};
  private images: Map<HTMLImageElement> = {};

  // Volatile caching removes items in insertion order once it reaches certain size
  private vtextures: VolatileMap<Texture> = new VolatileMap(100);
  private vimages: VolatileMap<HTMLImageElement> = new VolatileMap(100);

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new ResourceLoader();
    return this.instance;
  }

  public async get(path: string) {
    if (this.textures[path]) return this.textures[path];

    this.textures[path] = new Texture(path);
    await this.textures[path].load();

    return this.textures[path];
  }

  public async layers(paths: string[], prefix = '') {
    const key = paths.join('');

    if (!this.vimages.get(key)) {
      const imgs = await Promise.all(
        paths.map((p) => prefix + p).map((p) => this.loadImage(p))
      );

      const w = Math.max(...imgs.map((i) => i.width));
      const h = Math.max(...imgs.map((i) => i.height));

      const canvas = document.createElement('canvas');

      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d');
      imgs.forEach((i) => ctx.drawImage(i, 0, 0));

      this.vimages.set(
        key,
        await this.loadImage(canvas.toDataURL('image/png'), false)
      );
    }

    return async (p: [number, number, number, number]) => {
      const k = key + p.join('');
      if (this.vtextures.get(k)) return this.vtextures.get(k);

      this.vtextures.set(k, new Texture(this.crop(this.vimages.get(key), p)));
      await this.vtextures.get(k).load();
      return this.vtextures.get(k);
    };
  }

  /**
   *
   * @param query Format path_posx_posy_w_h
   */
  public async query(query: string) {
    if (this.textures[query]) return this.textures[query];

    const [path, sx, sy, sw, sh] = query.split('_');
    const [x, y, w, h] = [sx, sy, sw, sh].map((s) => parseInt(s, 10));

    const img = await this.loadImage(path);
    this.textures[query] = new Texture(this.crop(img, [x, y, w, h]));
    await this.textures[query].load();

    return this.textures[query];
  }

  public async getSheet(s: Tiled.TileSheet) {
    const id = s.name;
    if (this.sheets[id]) return { id, sheet: this.sheets[id] };

    const path = `./assets/maps/${s.image}`;

    const tex = await this.get(path);
    const cols = s.imagewidth / s.tilewidth;
    const rows = s.imageheight / s.tileheight;

    const sheet = new SpriteSheet(tex, cols, rows, s.tilewidth, s.tileheight);
    this.sheets[id] = sheet;

    return { id, sheet };
  }

  private async loadImage(src: string, cache = true) {
    if (this.images[src]) return this.images[src];

    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        if (cache) this.images[src] = img;
        resolve(img);
      };

      img.onerror = reject;
      img.src = src;
    });
  }

  private crop(img: HTMLImageElement, p: [number, number, number, number]) {
    const [x, y, w, h] = p;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d'); // so we can draw
    ctx.drawImage(img, -x, -y);

    return canvas.toDataURL('image/png');
  }
}

export function Resources() {
  return ResourceLoader.get();
}
