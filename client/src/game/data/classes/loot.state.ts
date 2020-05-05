import { IItem, IUpdateLoot } from '../../shared';
import { Observable, Map } from 'simple-structures';

export class LootState {
  public current: Observable<IItem[]> = new Observable([]);
  private loots: Map<IItem[]> = {};
  public currentId: string;

  public setCurrent(id: string) {
    this.currentId = id;
    this.current.replace(this.loots[id] ?? []);
  }

  public updateMany(update: IUpdateLoot[]) {
    update.forEach((u) => this.update(u.id, u.items));
  }

  public update(id: string, items: IItem[]) {
    this.loots[id] = items;

    if (this.currentId === id) this.setCurrent(id);
  }

  public delete(id: string) {
    delete this.loots[id];
    if (this.currentId === id) this.setCurrent('');
  }
}
