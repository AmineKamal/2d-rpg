import * as puppeteer from "puppeteer";
import { MapLocation, MAPS } from "../shared";

export class ClientManager {
  public static async launch() {
    const b = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process", // <- this one doesn't works in Windows
        "--disable-gpu",
      ],
      headless: true,
    });

    await Promise.all(MAPS.map((m) => this.page(b, m)));
  }

  private static async page(b: puppeteer.Browser, map: MapLocation) {
    const p = await b.newPage();
    await p.goto("http://localhost:4201/?map=" + map);
  }
}
