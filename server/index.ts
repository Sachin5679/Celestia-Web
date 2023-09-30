import "dotenv/config";

import express from "express";
import cors from "cors";
import indexRouter from "./src/routes/_index";
import mongoose from "mongoose";

import { frontendUrl } from "./config";

const PORT = Number(process.env.PORT) || 9000;

const app = express();

app.use(cors()); //{ origin: frontendUrl }));
app.use(express.json());
app.use(express.urlencoded());

app.use("/", indexRouter);

async function main() {
  await mongoose.connect(process.env.DB_URI);

  app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });
}

main().catch((err) => console.error(err));
