export class Actions {
  private static instance: Actions;
  private locked = true;

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new Actions();
    return this.instance;
  }

  private constructor() {}

  public lock() {
    this.locked = true;
  }

  public unlock() {
    this.locked = false;
  }

  public attack(f: () => void) {
    document.body.addEventListener('keyup', (e) => {
      if (e.code === 'Space' && !this.locked) f();
    });
  }

  public skill(f: () => void) {
    document.body.addEventListener('keyup', (e) => {
      if (e.code === 'ControlLeft' && !this.locked) f();
    });
  }

  public dash(f: () => void) {
    document.body.addEventListener('keyup', (e) => {
      if (e.code === 'ControlRight' && !this.locked) f();
    });
  }
}
