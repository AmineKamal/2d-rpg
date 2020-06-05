export class Actions {
  private static instance: Actions;

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new Actions();
    return this.instance;
  }

  private constructor() {}

  public attack(f: () => void) {
    document.body.addEventListener('keyup', (e) => {
      if (e.code === 'Space') f();
    });
  }

  public skill(f: () => void) {
    document.body.addEventListener('keyup', (e) => {
      if (e.code === 'ControlLeft') f();
    });
  }
}
