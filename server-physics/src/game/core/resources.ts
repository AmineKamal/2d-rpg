import { Texture, SpriteSheet } from 'excalibur';
import { Map } from 'simple-structures';
import * as Tiled from './tiled';

export class ResourceLoader {
  private constructor() {}
  private static instance: ResourceLoader;

  private textures: Map<Texture> = {};
  private sheets: Map<SpriteSheet> = {};
  private images: Map<HTMLImageElement> = {};

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

  /**
   *
   * @param path Format path_posx_posy_w_h
   */
  public async query(query: string) {
    if (this.textures[query]) return this.textures[query];

    const [path, sx, sy, sw, sh] = query.split('_');
    const [x, y, w, h] = [sx, sy, sw, sh].map((s) => parseInt(s, 10));

    if (!this.images[path]) this.images[path] = await this.loadImage(path);

    const img = this.images[path];
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

  private dataUrl(src: string) {
    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(this.convert(img));
      img.onerror = reject;
      img.src = src;
    });
  }

  private loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  private convert(img: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    return canvas.toDataURL('image/png');
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
