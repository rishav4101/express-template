require("dotenv").config();

import express, { Request, Response } from "express";
import http from "http";
import compression from "compression";
import cluster from "cluster";
import helmet from "./middlewares/helmet";
import cors from "./middlewares/cors";
import logging from "./middlewares/logging"

if (cluster.isMaster) {
  let cpuCount: number = require("os").cpus().length;
  console.log("CPU Count: " + cpuCount);
  for (var i = 0; i < cpuCount; i += 1) cluster.fork();
} else {
  const app = express();

  app.use(cors);
  app.use(express.json());
  app.use(compression());
  app.use(helmet);
  app.use(logging)

  app.get("/", (req: Request, res: Response) => {
    return res.send({
      status: "online",
      host: req.headers.host,
    });
  });

  const server = http.createServer(app);
  const PORT = process.env.PORT || 8000;

  server.listen(PORT, () => console.log(`Server started at port ${PORT}`));
}