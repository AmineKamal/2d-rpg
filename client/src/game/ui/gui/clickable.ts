import { UIActor, Vector } from 'excalibur';
import { isMobile } from '../../core/device';

export class Clickable extends UIActor {
  private static clickables: Clickable[] = [];

  private pointerIgnoreFlag = false;
  private enabledbl: boolean;
  private _cl: () => void;
  private _dbl: () => void;
  private click = 0;

  public constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    edbl: boolean = true,
    cl?: () => void,
    dbl?: () => void
  ) {
    super(x, y, w, h);
    this.enabledbl = edbl;
    if (cl) this._cl = cl;
    if (dbl) this._dbl = dbl;

    Clickable.clickables.push(this);
  }

  public static init() {
    document.body.addEventListener('pointerup', (ev) => {
      const x = ev.clientX;
      const y = ev.clientY;

      const cls = this.clickables.filter((c) =>
        c.getBounds().contains(new Vector(x, y))
      );

      cls.forEach((c) => c.onclick());
    });
  }

  protected conditon() {
    return true;
  }

  protected cl() {
    this._cl();
  }

  protected dbl() {
    this._dbl();
  }

  private checkCondition() {
    const parent = this.parent ? this.parent.visible : true;

    return this.visible && parent && this.conditon();
  }

  protected onclick() {
    if (!this.checkCondition()) return;

    if (!this.enabledbl) return this.cl();

    if (isMobile()) {
      this.pointerIgnoreFlag = !this.pointerIgnoreFlag;
      if (this.pointerIgnoreFlag) return;
    }

    if (this.click === 0) {
      setTimeout(() => {
        if (this.click === 1) this.cl();
        else if (this.click > 1) this.enabledbl ? this.dbl() : this.cl();
        this.click = 0;
      }, 350);
    }

    this.click++;
  }
}
