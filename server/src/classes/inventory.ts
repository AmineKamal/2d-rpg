import { IItem } from "../shared";

export class Inventory {
  private max: number;
  private data: IItem[];

  public constructor(max: number, data: IItem[]) {
    this.data = data.splice(0, max);
    this.max = max;
  }

  public get(i: number) {
    return this.data[i];
  }

  public add(...data: IItem[]): IItem[] {
    this.addExisting(data);

    const existing = data.filter((i) =>
      this.data.find((it) => it.name === i.name)
    );

    const newItems = data.filter(
      (i) => !this.data.find((it) => it.name === i.name)
    );

    const remaining = this.max - this.data.length;
    const items = newItems.splice(0, remaining);
    this.data.push(...items);

    return [...items, ...existing];
  }

  public remove(idx: number) {
    this.data.splice(idx, 1);
  }

  public indexOf(item: IItem) {
    const idx = this.data.findIndex(
      (i) => i.name === item.name && i.quantity > 0
    );
    return idx;
  }

  private addExisting(data: IItem[]) {
    this.data.forEach((existing) => {
      const sameItem = data.find((it) => it.name === existing.name);

      if (sameItem) {
        existing.quantity += sameItem.quantity;
      }
    });
  }

  export() {
    return this.data;
  }
}
