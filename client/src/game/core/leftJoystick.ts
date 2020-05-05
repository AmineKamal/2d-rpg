import * as J from 'nipplejs';
import { initStrict, StrictMap } from 'simple-structures';
import { Direction } from '../shared';

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
  private manager: J.JoystickManager;

  private firedKeys: FiredKeys = initStrict(KEYBOARD_KEYS, false);
  private locked = true;
  private _end: () => void;
  private _f: (d: Direction) => void;

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new LeftJoystick();
    return this.instance;
  }

  public dir(f: (d: Direction) => void) {
    this._f = f;
    this.manager.on('dir', (_, d) => {
      if (!this.locked) f(d.direction.angle as Direction);
    });
    this.keydown();
    return this;
  }

  public end(f: () => void) {
    this._end = f;
    this.manager.on('end', (_e, _d) => f());
    this.keyup(f);
  }

  public lock(end = false) {
    this.locked = true;
    if (end && this._end) {
      this._end();
    }
  }

  public unlock(end = false) {
    this.locked = false;
    const key = KEYBOARD_KEYS.find((k) => this.firedKeys[k]);
    if (key && this._f) this._f(this.keyDirection(key));
    if (!key && end && this._end) this._end();
  }

  private keydown() {
    document.body.addEventListener('keydown', (e) => {
      const key = e.key as KeyboardKey;

      if (KEYBOARD_KEYS.indexOf(key as any) !== -1) {
        if (!this.firedKeys[key]) {
          this.firedKeys[key] = true;
          if (!this.locked) this._f(this.keyDirection(key));
        }
      }
    });
  }

  private keyup(f: () => void) {
    document.body.addEventListener('keyup', (e) => {
      const key = e.key as KeyboardKey;

      if (KEYBOARD_KEYS.indexOf(key as any) !== -1) {
        this.firedKeys[key] = false;
        if (this.allup) f();
      }
    });
  }

  private keyDirection(key: KeyboardKey): Direction {
    switch (key) {
      case 'a':
        return 'left';
      case 's':
        return 'down';
      case 'd':
        return 'right';
      case 'w':
        return 'up';
    }
  }
}

const KEYBOARD_KEYS = ['a', 's', 'd', 'w'] as const;
type KeyboardKey = typeof KEYBOARD_KEYS[number];
type FiredKeys = StrictMap<KeyboardKey, boolean>;
