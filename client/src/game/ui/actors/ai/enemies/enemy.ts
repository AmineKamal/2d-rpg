import {
  Label,
  TextAlign,
  Color,
  CollisionStartEvent,
  Sprite,
} from 'excalibur';
import {
  IEnemy,
  EnemySprite,
  AIEnemy,
  IEnemyAttacked,
} from '../../../../shared';
import { AnimationLoader } from '../../../../core/animation';
import { AI } from '../ai';
import { Fonts } from '../../../../core/fonts';
import { SmallBar } from '../../../gui/smallbar';
import { State } from 'src/game/data/state';
import { LootEnemy } from '../../props/lootEnemy';
import { Enemies } from './enemies';

const EW = 32 as const;
const EH = 32 as const;

export class Enemy extends AI<EnemySprite> {
  private constructor(init: IEnemy) {
    super({ ...init, w: EW, h: EH });
    this.nameLabel.pos.y = -30;
    this.nameLabel.text = `level ${this.threat} ${this.name}`;
    this.createHealthBar(init.stats.health.points, init.attributes.health);
    this.createExclamation();
    this.createDamage();
    this.dead = init.dead;
  }

  public target: string = undefined;
  public deadSprite: Sprite;
  private healthBar: SmallBar;
  private exclamationLabel: Label;
  private damageLabel: Label;
  private damageRemover: any;
  public dead: boolean;

  public static async create(init: IEnemy) {
    const e = new Enemy(init);
    await AnimationLoader.get().enemy(e.sprite, e);
    e.setAnimation('i_down');
    return e;
  }

  public static async createProp(init: IEnemy) {
    const e = new Enemy(init);
    await AnimationLoader.get().enemy(e.sprite, e);
    return e.createProp();
  }

  public track(track: AIEnemy) {
    super.track(track);
    this.exclamationLabel.visible =
      track.current === 'follow' && !this.damageLabel.visible;
  }

  public receiveAttack(state: IEnemyAttacked) {
    this.healthBar.val(state.attributes.health);

    if (this.damageRemover) clearTimeout(this.damageRemover);
    this.damageLabel.text = state.damage.toString();
    this.damageLabel.visible = true;
    const exclamationVisible = this.exclamationLabel.visible;
    this.exclamationLabel.visible = false;

    this.damageRemover = setTimeout(() => {
      this.damageLabel.visible = false;
      this.exclamationLabel.visible = exclamationVisible;
    }, 500);

    if (state.loot) State.get().loot.update(this.ID, state.loot);
    if (state.dead) Enemies.get().kill(this.ID);
  }

  private createExclamation() {
    this.exclamationLabel = new Label('!', 0, -45, null, Fonts.get().vermelha);
    this.exclamationLabel.fontSize = 20;
    this.exclamationLabel.textAlign = TextAlign.Center;
    this.exclamationLabel.visible = false;
    this.add(this.exclamationLabel);
  }

  private createHealthBar(max: number, current: number) {
    this.healthBar = new SmallBar(-32, -25, 64, 5, max, current);
    this.add(this.healthBar);
  }

  private createDamage() {
    this.damageLabel = new Label('', 0, -45, null, Fonts.get().vermelha);
    this.damageLabel.fontSize = 12;
    this.damageLabel.textAlign = TextAlign.Center;
    this.damageLabel.visible = false;
    this.add(this.damageLabel);
  }

  public createProp() {
    if (!this.deadSprite) return;

    const prop = new LootEnemy(
      this.pos.x,
      this.pos.y,
      this.width,
      this.height,
      this.ID,
      this.deadSprite
    );

    return prop;
  }
}
