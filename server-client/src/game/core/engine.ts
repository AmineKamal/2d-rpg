import * as ex from 'excalibur';
import { MapLocation } from '../shared';
import { MapLoader } from './map';
import { Color, Actor } from 'excalibur';
import { Players } from '../actors/players/players';
import { Enemies } from '../actors/ai/enemies/enemies';
import { Observable } from 'simple-structures';

export class Engine extends ex.Engine {
  private constructor() {
    super({
      canvasElementId: 'game',
      backgroundColor: Color.Black,
      width: 1600,
      height: 1600,
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
      console.log('START');
      this.started.next(true);
      return super.start();
    }
  }

  public stopEngine() {
    if (this.started.value) {
      this.started.next(false);
      return super.stop();
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
  }
}
