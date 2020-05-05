import { MapLocation } from './shared';

export class State {
  private static instance: State;

  public map: MapLocation;

  private constructor() {}

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new State();
    return this.instance;
  }

  setMap(map: MapLocation) {
    this.map = map;
  }
}
