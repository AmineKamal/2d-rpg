import * as J from 'nipplejs';
import { initStrict, StrictMap } from 'simple-structures';
import { Direction, Dir, TO_DIR } from '../shared';

export class LeftJoystick {
  private constructor() {
    this.manager = J.create({
      zone: document.getElementById('left-joystick-zone'),
    });
  }

  public get allup() {
    return Object.keys(this.firedKeys).every(
      (k: KeyboardKey) => !this.firedKeys[k]
    );
  }

  private static instance: LeftJoystick;

  public virtualJoystickOn = false;

  private manager: J.JoystickManager;
  private firedKeys: FiredKeys = initStrict(KEYBOARD_KEYS, false);
  private locked = true;
  private currentDir: Direction = 0;
  private _end: () => void;
  private _f: (d: Direction) => void;

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new LeftJoystick();
    return this.instance;
  }

  public dir(f: (d: Direction) => void) {
    this._f = f;
    this.manager.on('move', (_, d) => {
      this.virtualJoystickOn = true;
      if (!this.locked && this.dirChange(d.angle.degree)) f(d.angle.degree);
    });
    this.keydown();
    return this;
  }

  public end(f: () => void) {
    this._end = f;
    this.manager.on('end', (_e, _d) => {
      this.virtualJoystickOn = false;
      f();
    });
    this.keyup();
  }

  public lock(end = false) {
    this.locked = true;
    if (end && this._end) {
      this._end();
    }
  }

  public unlock(end = false) {
    this.locked = false;
    const allup = this.allup;
    if (!allup && this._f) this._f(this.keyDirection());
    if (allup && end && this._end) this._end();
  }

  private dirChange(newDir: Direction) {
    if (Math.abs(this.currentDir - newDir) < 5) return false;

    this.currentDir = newDir;
    return true;
  }

  private keydown() {
    document.body.addEventListener('keydown', (e) => {
      const key = e.key as KeyboardKey;

      if (KEYBOARD_KEYS.indexOf(key as any) !== -1) {
        if (!this.firedKeys[key]) {
          this.firedKeys[key] = true;
          if (!this.locked) this._f(this.keyDirection());
        }
      }
    });
  }

  private keyup() {
    document.body.addEventListener('keyup', (e) => {
      const key = e.key as KeyboardKey;

      if (KEYBOARD_KEYS.indexOf(key as any) !== -1) {
        this.firedKeys[key] = false;
        if (this.allup) this._end();
        else if (!this.locked) this._f(this.keyDirection());
      }
    });
  }

  private keyDirection(): Direction {
    let keys = Object.keys(this.firedKeys).filter((k) => this.firedKeys[k]);

    // Removing conflicts
    if (keys.includes('a') && keys.includes('d'))
      keys = keys.filter((k) => ['a', 'd'].includes(k));
    if (keys.includes('s') && keys.includes('w'))
      keys = keys.filter((k) => ['s', 'w'].includes(k));

    if (keys.length === 0) return -1;
    const map = keys.map((k) => KEY_MAPPER[k]);

    const sum = map.reduce((a, b) => a + b, 0);
    const avg = sum / map.length || 0;

    return avg === 135 && keys.includes('d') ? 315 : avg;
  }
}

const KEYBOARD_KEYS = ['a', 's', 'd', 'w'] as const;
type KeyboardKey = typeof KEYBOARD_KEYS[number];
type FiredKeys = StrictMap<KeyboardKey, boolean>;

const KEY_MAPPER = {
  d: 0,
  w: 90,
  a: 180,
  s: 270,
};
