import { Actor, CollisionType, Color, CollisionStartEvent } from 'excalibur';
import { IEnemy, AIEnemy } from '../../../shared';
import { Player } from '../../players/player';
import { Child } from '../../child';
import { AI } from '../ai';
import { tuple } from 'simple-structures';
import { Players } from '../../players/players';

const EW = 32 as const;
const EH = 32 as const;

export class Enemy extends AI {
  private constructor(init: IEnemy) {
    super({ ...init, w: EW, h: EH });
    this.color = Color.Red;
    this.createDetection();
    this.createLoss();
    this.onCollision();
  }

  public detection: Child;
  public loss: Child;
  public target: string = undefined;

  public static async create(init: IEnemy) {
    const e = new Enemy(init);
    return e;
  }

  public export(): Actor[] {
    return [this.loss, this.detection, ...super.export()];
  }

  public track(track: AIEnemy) {
    super.track(track);
  }

  private createDetection() {
    this.detection = this.createCircleChild(3, Color.Yellow);
  }

  private createLoss() {
    this.loss = this.createCircleChild(6, Color.Green);
  }

  private createCircleChild(mod: number, color: Color) {
    const w = this.width * mod;
    const h = this.height * mod;
    const child = new Child(this, 0, 0, w, h, color);

    child.body.collider.type = CollisionType.Passive;
    child.body.useCircleCollider(this.width * mod);
    child.visible = true;
    child.opacity = 0.05;

    return child;
  }

  private onCollision() {
    this.on('collisionstart', (ev: CollisionStartEvent<Player | Child>) => {
      this.onColStart(ev);
    });

    this.detection.on('collisionstart', (ev: CollisionStartEvent<Player>) => {
      this.onDetection(ev);
    });

    this.loss.on('collisionend', (ev: CollisionStartEvent<Player>) => {
      this.onLoss(ev);
    });
  }

  private onColStart(ev: CollisionStartEvent<Player | Child>) {
    if ([this.detection, this.attackBox.actor].includes(ev.other as Child))
      return;

    if (!ev.other.name || !Players.get().isPlayer(ev.other.name)) {
      if (this.tasks.current !== 'routine') return;

      // Change Direction
      this.tasks.routine.stop();
      this.tasks.routine.start();
      return;
    }
  }

  private onDetection(ev: CollisionStartEvent<Player | Child>) {
    if (this.tasks.current === 'follow') return;
    if (!ev.other.name || !Players.get().isPlayer(ev.other.name)) return;

    this.tasks.routine.stop();
    this.target = ev.other.name;
    this.tasks.follow.start(ev.other);
  }

  private onLoss(ev: CollisionStartEvent<Player | Child>) {
    if (this.tasks.current !== 'follow') return;
    if (!ev.other.name || ev.other.name !== this.target) return;

    this.tasks.follow.stop();

    let cols = Players.get().players.map((p) =>
      tuple(
        p,
        this.detection.body.collider.bounds.intersect(p.body.collider.bounds)
      )
    );

    cols = cols.filter(([_, c]) => c);

    if (cols.length === 0) {
      this.target = undefined;
      this.tasks.routine.start();
      return;
    }

    const distances = cols.map(([_, c]) => this.detection.pos.distance(c));
    const other = cols[distances.indexOf(Math.min(...distances))][0];
    this.target = other.name;
    this.tasks.follow.start(other);
  }
}
