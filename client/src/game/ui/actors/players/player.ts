import { UserSprite, IUser, IUserEquipement, IUserDNA } from '../../../shared';
import { AnimationLoader } from '../../../core/animation';
import { Animatable } from '../animatable';
import { Actor, Animation, Engine } from 'excalibur';
import { PlayerTasks } from './player.tasks';
import { Fade } from '../fade';

const PW = 32 as const;
const PH = 32 as const;

export class Player extends Animatable<UserSprite> {
  private constructor(init: IUser) {
    super({ ...init, w: PW, h: PH, id: '' });
    this.tasks = new PlayerTasks(this);
    this.equipement = init.equipement;
    this.dna = init.dna;
  }

  public tasks: PlayerTasks;
  public dna: IUserDNA;
  public equipement: Partial<IUserEquipement>;
  public dash = false;

  public static async init(init: IUser) {
    const p = new Player(init);
    await AnimationLoader.get().character(p);
    p.setAnimation('i_down');
    return p;
  }

  public draw(ctx: CanvasRenderingContext2D, delta: number) {
    if (this.dash) this.fade();
    super.draw(ctx, delta);
  }

  public async redraw(equipement: Partial<IUserEquipement>, dna?: IUserDNA) {
    this.equipement = equipement;
    if (dna) this.dna = dna;
    await AnimationLoader.get().character(this);
    this.setAnimation(this.currentAnimation);
  }

  public export(): Actor[] {
    return [...super.export()];
  }

  public fade() {
    const anim = this.currentDrawing as Animation;

    if (!anim.sprites || !anim.currentFrame) return;
    const s = anim.sprites[anim.currentFrame].clone();

    Fade.init(this, s);
  }
}
