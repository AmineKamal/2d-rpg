import * as puppeteer from "puppeteer";
import { MapLocation, MAPS } from "../shared";

export class ClientManager {
  public static async launch() {
    const b = await puppeteer.launch();

    await Promise.all(MAPS.map((m) => this.page(b, m)));
  }

  private static async page(b: puppeteer.Browser, map: MapLocation) {
    const p = await b.newPage();

    await p.goto("http://localhost:4201/?map=" + map);

    p.on("console", (message) =>
      console.log(
        `${message.type().substr(0, 3).toUpperCase()} ${message.text()}`
      )
    )
      .on("pageerror", ({ message }) => console.log(message))
      .on("response", (response) =>
        console.log(`${response.status()} ${response.url()}`)
      )
      .on("requestfailed", (request) =>
        console.log(`${request.failure().errorText} ${request.url()}`)
      );
  }
}
