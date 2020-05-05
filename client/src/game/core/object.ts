import * as Tiled from './tiled';
import { Actor, CollisionType, Color } from 'excalibur';
import { Resources } from './resources';
import { Portal } from '../ui/actors/portal';
import { PROPS, PropType } from '../ui/actors/props/props';

export class ObjectLoader {
  private static instance: ObjectLoader;
  private constructor() {}

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new ObjectLoader();
    return this.instance;
  }

  public async loadObject(object: Tiled.Object) {
    const path = `./assets/maps/objects/${object.name}`;
    const sprite = (await Resources().get(path)).asSprite();
    const actor = await PROPS[object.type as PropType](object, sprite);

    return actor;
  }

  public async loadCollision(object: Tiled.Object) {
    return this.createActor(object, Color.Red, CollisionType.Fixed);
  }

  public async loadPortal(object: Tiled.Object) {
    return new Portal(object);
  }

  public clone(actor: Actor) {
    const clone = new Actor(
      actor.pos.x,
      actor.pos.y,
      actor.width,
      actor.height
    );

    clone.color = actor.color;
    clone.visible = actor.visible;
    clone.body.collider.type = actor.body.collider.type;

    return clone;
  }

  private createActor(obj: Tiled.Object, color: Color, coll: CollisionType) {
    const x = obj.x + obj.width / 2;
    const y = obj.y + obj.height / 2;
    const actor = new Actor(x, y, obj.width, obj.height);

    actor.color = color;
    actor.visible = false;
    actor.body.collider.type = coll;

    return actor;
  }
}
