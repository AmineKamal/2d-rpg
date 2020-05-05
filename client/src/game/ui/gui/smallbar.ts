import { UIActor, Color } from 'excalibur';

export class SmallBar extends UIActor {
  private current: number;
  private max: number;
  private empty: UIActor;
  private full: UIActor;

  public constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    max: number,
    current?: number
  ) {
    super(x, y, w, h);
    this.max = max;
    this.current = current ?? max;
    this.createFull();
    this.createEmpty();
  }

  public val(current: number) {
    this.current = current;
    const fw = (this.current / this.max) * this.width;
    const ew = ((this.max - this.current) / this.max) * this.width;

    this.full.width = fw;
    this.empty.width = ew;
    this.empty.pos.x = fw;
  }

  private createFull() {
    const w = (this.current / this.max) * this.width;
    this.full = new UIActor(0, 0, w, this.height);
    this.full.color = Color.Red;
    this.add(this.full);
  }

  private createEmpty() {
    const w = ((this.max - this.current) / this.max) * this.width;
    this.empty = new UIActor(this.full.width, 0, w, this.height);
    this.empty.color = Color.Gray;
    this.add(this.empty);
  }
}
