import * as ex from 'excalibur';
import { MapLocation } from '../shared';
import { MapLoader } from './map';
import { Loader, Color, Actor, DisplayMode } from 'excalibur';
import { Players } from '../ui/actors/players/players';
import { Enemies } from '../ui/actors/ai/enemies/enemies';
import { Observable } from 'simple-structures';
import { Inventory } from '../ui/gui/inventory';
import { Equipement } from '../ui/gui/equipement';
import { Loot } from '../ui/gui/loot';

export class Engine extends ex.Engine {
  private constructor() {
    super({
      canvasElementId: 'game',
      backgroundColor: Color.Black,
      displayMode: DisplayMode.FullScreen,
    });
  }
  private static instance: Engine;

  public started = new Observable(false);

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new Engine();
    return this.instance;
  }

  public startEngine() {
    if (!this.started.value) {
      this.started.next(true);
      return super.start();
    }
  }

  public async goto(map: MapLocation) {
    if (this.scenes[map]) this.teleport(map);

    const scene = await MapLoader.get().load(this, map);
    this.addScene(map, scene);
    this.teleport(map);
  }

  public removeActor(actor: Actor | Actor[]) {
    const array = Array.isArray(actor) ? actor : [actor];
    array.forEach((a) => this.currentScene.remove(a));
  }

  public addActor(actor: Actor | Actor[]) {
    const array = Array.isArray(actor) ? actor : [actor];
    array.forEach((a) => this.currentScene.add(a));
  }

  private teleport(map: MapLocation) {
    this.goToScene(map);
    Players.get().players.forEach((p) => this.addActor(p.export()));
    Enemies.get().enemies.forEach((e) => this.addActor(e.export()));
    Enemies.get().props.forEach((e) => this.addActor(e));
    this.currentScene.add(Inventory.get());
    this.currentScene.add(Equipement.get());
    this.currentScene.add(Loot.get());
    this.currentScene.camera.strategy.lockToActor(Players.get().self);
    this.currentScene.camera.zoom(1.75);
  }
}
