import {
  UserSprite,
  DIRECTIONS,
  IDLE_DIRECTIONS,
  EnemySprite,
  MOVE_DIRECTIONS,
  SLASH_DIRECTIONS,
  THRUST_DIRECTIONS,
  SPELL_DIRECTIONS,
  SHOOT_DIRECTIONS,
  OVERSIZE_DIRECTIONS,
  DEAD,
} from '../shared';
import { Resources } from './resources';
import { SpriteSheet, Texture } from 'excalibur';
import { Engine } from './engine';
import { tuple, swap } from 'simple-structures';
import { Animatable } from '../ui/actors/animatable';
import { Drawer } from './drawer';
import { Player } from '../ui/actors/players/player';
import { Enemy } from '../ui/actors/ai/enemies/enemy';

type Crop = (c: [number, number, number, number]) => Promise<Texture>;

export class AnimationLoader {
  private static instance: AnimationLoader;
  private constructor() {}

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new AnimationLoader();
    return this.instance;
  }

  public async character(actor: Player) {
    const f = await Drawer.draw(actor.dna, actor.equipement);
    await this.loadMove(actor, '', f);
    await this.loadSpell(actor, '', f);
    await this.loadDead(actor, '', f);

    switch (actor.equipement.weapon?.attackType) {
      case 'oversize':
        return await this.loadOverS(actor, '', f);
      case 'shoot':
        return await this.loadShoot(actor, '', f);
      case 'thrust':
        return await this.loadThrust(actor, '', f);
      case 'spell':
        return;
      default:
        return await this.loadSlash(actor, '', f);
    }
  }

  public async enemy(sprite: EnemySprite, actor: Enemy) {
    const path = `./assets/enemies/${sprite}/`;
    await this.loadMove(actor, path);
    actor.deadSprite = await this.loadDead(actor, path);
    await this.loadSpell(actor, path);
  }

  private async loadMove(actor: Animatable<string>, path: string, f?: Crop) {
    const base = f ? 8 : path + 'movement/';
    const opts = { idle: true, loop: true };
    await this.load(base, 9, 1, 64, 64, 100, MOVE_DIRECTIONS, actor, opts, f);
  }

  private async loadSlash(actor: Animatable<string>, path: string, f?: Crop) {
    const base = f ? 12 : path + 'slash/';
    const dir = SLASH_DIRECTIONS;
    await this.load(base, 6, 1, 64, 64, 75, dir, actor, {}, f);
  }

  private async loadThrust(actor: Animatable<string>, path: string, f?: Crop) {
    const base = f ? 4 : path + 'thrust/';
    const dir = THRUST_DIRECTIONS;
    await this.load(base, 7, 1, 64, 64, 75, dir, actor, {}, f);
  }

  private async loadSpell(actor: Animatable<string>, path: string, f?: Crop) {
    const base = f ? 0 : path + 'spell/';
    const dir = SPELL_DIRECTIONS;
    await this.load(base, 7, 1, 64, 64, 75, dir, actor, {}, f);
  }

  private async loadShoot(actor: Animatable<string>, path: string, f?: Crop) {
    const base = f ? 16 : path + 'shoot/';
    const dir = SHOOT_DIRECTIONS;
    await this.load(base, 13, 1, 64, 64, 75, dir, actor, {}, f);
  }

  private async loadOverS(actor: Animatable<string>, path: string, f?: Crop) {
    const base = f ? 21 : path + 'oversize/';
    const dir = OVERSIZE_DIRECTIONS;
    await this.load(base, 6, 1, 192, 192, 75, dir, actor, {}, f);
  }

  private async loadDead(actor: Animatable<string>, path: string, f?: Crop) {
    const base = f ? 20 : path + 'dead/';
    const opts = { dirs: ['dead'] as const };
    const fs = 6;
    const s = await this.load(base, fs, 1, 64, 64, 100, DEAD, actor, opts, f);

    return s[0].getSprite(fs - 1);
  }

  private async load<T extends string>(
    q: string | number,
    c: number,
    r: number,
    w: number,
    h: number,
    speed: number,
    animations: readonly T[],
    actor: Animatable<string>,
    opts: { idle?: boolean; dirs?: readonly string[]; loop?: boolean } = {},
    f?: Crop
  ) {
    const directions = opts.dirs ? opts.dirs : DIRECTIONS;
    const textures = await this.loadTextures(q, directions, c, f);
    const sheets = textures.map((t) => new SpriteSheet(t, c, r, w, h));
    const idles = opts.idle ? sheets.map((s) => s.getSprite(0)) : [];

    const drawings = animations.map((d, i) =>
      tuple(d, sheets[i].getAnimationForAll(Engine.get(), speed))
    );

    drawings.forEach(([_, a]) => (a.loop = opts.loop ? opts.loop : false));

    const idleDrawings = opts.idle
      ? IDLE_DIRECTIONS.map((d, i) => tuple(d, idles[i]))
      : [];

    [...drawings, ...idleDrawings].forEach(([k, s]) => actor.addDrawing(k, s));

    return sheets;
  }

  private async loadTextures(
    q: string | number,
    dir: readonly string[],
    c: number,
    f?: Crop
  ) {
    if (typeof q === 'number' && f) {
      const y = q * 64;
      const crops = [0, 1, 2, 3].map((v) => tuple(0, y + v * 64, c * 64, 64));
      swap(crops, 1, 2);
      return await Promise.all(crops.map((p) => f(p)));
    }

    const paths = dir.map((d) => q + d + '.png');
    return await Promise.all(paths.map((p) => Resources().get(p)));
  }
}
