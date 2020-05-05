import { State } from '../../data/state';
import { InteractionType } from '../../data/classes/interaction.state';

class Interaction {
  private constructor() {
    this.init();
    State.get().interaction.data.subscribe((i) => {
      this.interact = i.run;
      this.toggle(i.active, i.type);
      this.active = i.active;
    });
  }
  private static instance?: Interaction;

  private interact: () => void;
  private active: boolean;

  public static get() {
    if (this.instance) return this.instance;
    this.instance = new Interaction();

    return this.instance;
  }

  private init() {
    const interaction = document.getElementById('interaction');
    const events = ['click', 'touchend'];
    events.forEach((e) =>
      interaction.addEventListener(e, (ev) => this.interact())
    );

    document.body.addEventListener('keyup', (e) => {
      if (e.code === 'Enter' && this.active) this.interact();
    });
  }

  private toggle(active: boolean, type: InteractionType) {
    const interaction = document.getElementById('interaction');
    interaction.style.display = active ? 'flex' : 'none';

    if (type === '') return;

    const img: any = document.getElementById('interaction-image');
    img.src = `./assets/interactions/${type}.svg`;
  }
}

export function startInteraction() {
  Interaction.get();
}
