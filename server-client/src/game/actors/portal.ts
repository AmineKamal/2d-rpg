import * as Tiled from '../core/tiled';
import { Actor, Color, CollisionType, CollisionStartEvent } from 'excalibur';
import { Player } from './players/player';
import { Sock } from '../socket/dispatcher';
import { MapLocation } from '../shared';
import { LeftJoystick } from '../core/leftJoystick';

export class Portal extends Actor {
  private name: MapLocation;

  public constructor(obj: Tiled.Object) {
    const x = obj.x + obj.width / 2;
    const y = obj.y + obj.height / 2;
    super(x, y, obj.width, obj.height);

    this.name = obj.name as MapLocation;
    this.visible = true;
    this.color = Color.White;
    this.body.collider.type = CollisionType.Passive;

    this.onCollision();
  }

  private onCollision() {}
}
