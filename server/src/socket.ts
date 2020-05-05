import { Server } from "http";
import * as socket from "socket.io";
import { UserManager } from "./controllers/user.manager";
import { MapManager } from "./controllers/map.manager";
import { SocketDispatcher } from "./socket/dispatcher";
import { IUserAttack } from "./shared";
import { MapLootManager } from "./controllers/map.Loot.manager";

export class Socket {
  public io: socket.Server;

  constructor(http: Server) {
    this.io = socket(http);
    this.connect();
  }

  public connect() {
    this.io.on("connection", (s: socket.Socket) => {
      const socket = new SocketDispatcher(s);
      this.handlers(socket);
      this.disconnectHandler(socket);
      console.log(`connected : ${s.id}`);
    });
  }

  private handlers(sock: SocketDispatcher) {
    // AI
    sock.on.ai(async (m) => {
      await MapManager.get().users.addAi(m, sock);

      sock.isAi = true;
    });

    // PLAYERS
    sock.on.create(async (c) => {
      await MapManager.get().users.add(
        UserManager.get().login(c.username, "c1", c.dna, sock)
      );

      sock.username = c.username;
      sock.isAi = false;

      return true;
    });

    // PLAYERS
    sock.on.move(async (mv) => {
      const name = sock.username;
      if (mv.pos) UserManager.get().setPosition(name, mv.pos);
      const users = MapManager.get().users.filter(name);
      const { dir, pos, speed } = mv;
      users.forEach((s) => s.emit.move({ dir, name, pos, speed }));
    });

    // PLAYERS
    sock.on.teleport(async (map) => {
      const name = sock.username;
      await MapManager.get().users.move(name, map);
    });

    // AI
    sock.on.track(async (track) => {
      MapManager.get().enemies.track(track);
      const users = MapManager.get().users.broadcast(track.map);
      users.forEach((s) => s.emit.track(track));
    });

    // PLAYERS
    sock.on.equip(async (item) => {
      console.log("EQUIP");
      const name = sock.username;
      const info = UserManager.get().updateEquipement(name, item);
      console.log(info);
      if (info) {
        const { inventory, equipement } = info;
        const users = MapManager.get().users.filter(name, false);
        users.forEach((s) => {
          if (s.id === sock.id) s.emit.equip({ name, equipement, inventory });
          else s.emit.equip({ name, equipement });
        });
      }
    });

    // PLAYERS
    sock.on.attack(async () => {
      const name = sock.username;
      const res = MapManager.get().users.filterAi(name);
      if (!res) return console.error("AI NOT FOUND FOR PLAYER");

      const { ai, m } = res;
      const enemies = await ai.emit.evaluateAttack(name);
      const user = UserManager.get().get(name);

      const attack: IUserAttack = {
        name,
        enemies: MapManager.get().enemies.userAttack(user, enemies, m),
      };

      const users = MapManager.get().users.broadcast(m);
      users.forEach((s) => s.emit.attack(attack));
    });

    // PLAYERS
    sock.on.loot(async (loot) => {
      const name = sock.username;
      const user = UserManager.get().get(name);
      const id = loot.id;
      if (!user) return {};

      const m = user.location.map;
      const lm = MapLootManager.get();

      const f = lm.check(m, id, loot.items);

      const added = user.inv.add(...f);
      lm.remove(m, id, added);

      const users = MapManager.get().users.broadcastUsers(m);
      const items = lm.get(m, id);

      users.forEach((s) => s.emit.loot({ id, items }));
      const inventory = user.inventory;

      return { inventory };
    });
  }

  private disconnectHandler(s: SocketDispatcher) {
    s.s.on("disconnect", () => {
      if (s.isAi) return;
      UserManager.get().logout(s.username);
      MapManager.get().users.remove(s.username);
      console.log(`Socket disconnected : ${s.id}`);
    });
  }
}
