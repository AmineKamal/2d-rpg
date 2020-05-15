import { Map } from "simple-structures/lib/lib/types";
import { SocketDispatcher } from "../socket/dispatcher";
import { UserSprite, IUserDNA, IItem } from "../shared";
import { User } from "../classes/user";
import { clone } from "simple-structures";

export class UserManager {
  private static instance: UserManager;

  public static get() {
    if (this.instance) return this.instance;

    this.instance = new UserManager();
    return this.instance;
  }

  private constructor() {}

  private users: Map<User> = {};

  public create(
    name: string,
    sprite: UserSprite,
    dna: IUserDNA,
    s: SocketDispatcher
  ) {
    this.users[name] = new User(name, sprite, dna, s);
    return this.users[name];
  }

  public update(name: string, u: Partial<User>) {
    const user = this.users[name];
    user.connected = u.connected ? u.connected : user.connected;
    user.id = u.id ? u.id : user.id;
    user.s = u.s ? u.s : user.s;
    user.location = u.location ? u.location : user.location;

    return this.users[name];
  }

  public get(name: string) {
    return this.users[name];
  }

  public login(
    name: string,
    sprite: UserSprite,
    dna: IUserDNA,
    s: SocketDispatcher
  ) {
    const connected = true;

    if (this.users[name]) this.update(name, { connected, s });
    else this.users[name] = new User(name, sprite, dna, s);

    return this.users[name];
  }

  public logout(name: string) {
    const user = this.users[name];
    user.connected = false;
    user.s = undefined;

    return user;
  }

  public setPosition(name: string, pos: { x: number; y: number }) {
    this.users[name].location.pos.x = pos.x;
    this.users[name].location.pos.y = pos.y;
  }

  public updateEquipement(name: string, item: IItem) {
    console.log(item);
    if (item.type !== "WEARABLE") return undefined;
    if (!item.equipSlot || !item.equipSprite) return undefined;

    console.log("WEARABLE");

    const user = this.users[name];
    const idx = user.inv.indexOf(item);

    if (idx === -1) return undefined;

    console.log("IN INVENTORY");

    const invItem = user.inv.get(idx);

    if (item.equipSlot === "quiver" || item.equipAll)
      item.quantity = invItem.quantity;
    else item.quantity = 1;

    user.equipement[item.equipSlot] = item;
    invItem.quantity -= item.quantity;

    if (invItem.quantity < 1) user.inv.remove(idx);

    const { equipement, inventory } = user;

    return { equipement, inventory };
  }
}
