import { Observable, StrictMap } from 'simple-structures';
import { PlayerStats } from '../../data/classes/player.stats';
import { State } from 'src/game/data/state';
import { UserAttribute } from 'src/game/shared';

type BarId = 'hp' | 'mp' | 'sp';

export class Bar {
  private static bars: Bar[] = [];

  private bar: HTMLProgressElement;
  private max = 100;
  private current = 100;
  private id: BarId;

  private constructor(id: BarId) {
    this.id = id;
    this.bar = document.getElementById(id) as HTMLProgressElement;
  }

  public static init(...ids: BarId[]) {
    ids.forEach((id) => {
      const b = new Bar(id);
      b.bindStats(State.get().player._stats);
      b.bindAttr(State.get().player._attributes);
      this.bars.push(b);
    });
  }

  private updateMax(max: number, current?: number) {
    this.max = max;
    this.current = current ?? max;
  }

  private pickStats(stats: PlayerStats) {
    console.log(stats);
    switch (this.id) {
      case 'hp':
        return stats.health?.points ?? 100;
      case 'mp':
        return stats.mana?.points ?? 100;
      case 'sp':
        return stats.stamina?.points ?? 100;
    }
  }

  private pickAttr(attr: StrictMap<UserAttribute, number>) {
    console.log(attr);
    switch (this.id) {
      case 'hp':
        return attr.health;
      case 'mp':
        return attr.mana;
      case 'sp':
        return attr.stamina;
    }
  }

  private update(current: number) {
    this.current = current;
    console.log(this.current, this.max);
    this.bar.value = this.current >= 0 ? this.current : 0;
  }

  bindStats(ob: Observable<PlayerStats>) {
    ob.subscribe((v) => this.updateMax(this.pickStats(v)));
  }

  bindAttr(ob: Observable<StrictMap<UserAttribute, number>>) {
    ob.subscribe((v) => this.update(this.pickAttr(v)));
  }
}
