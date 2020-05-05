import * as express from "express";
import { Socket } from "./socket";
import { ClientManager } from "./controllers/client.manager";

const app = express();
app.set("port", process.env.PORT || 3000);
app.set("host", "0.0.0.0");

const http = require("http").Server(app);
const socket = new Socket(http);

app.get("/", (req: any, res: any) => {
  res.json("SERVER");
});

http.listen(3000, "0.0.0.0");

ClientManager.launch();
