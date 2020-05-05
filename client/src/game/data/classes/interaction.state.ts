import { DataState } from '../data.state';
import { Observable } from 'simple-structures';

export class InteractionState implements DataState<Interaction> {
  public data = new Observable(new Interaction());

  public run() {
    this.data.value.run();
  }

  public get active() {
    return this.data.value.active;
  }

  public activate(type: InteractionType, f: () => void) {
    this.data.update((i) => {
      i.active = true;
      i.run = f;
      i.type = type;
    });
  }

  public deactivate() {
    this.data.update((i) => {
      i.active = false;
      i.run = () => {};
      i.type = '';
    });
  }
}

class Interaction {
  public type: InteractionType;
  public active: boolean;
  public run: () => void;

  public constructor(active?: boolean, run?: () => void, t?: InteractionType) {
    this.active = active ? active : false;
    this.run = run ? run : () => {};
    this.type = t ? t : '';
  }
}

export type InteractionType = '' | 'woodcutting' | 'loot';
