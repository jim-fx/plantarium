import express from "express";
const app = express();

//MIDDLEWARES
import helmet from "helmet";
import slow from "express-slow-down";
import cors from "cors";
import graphql from "./graphql";
import { version } from "../package.json";

const PROD = false;
const { PORT = 4000 } = process.env;

PROD && app.use(helmet());
PROD && app.enable("trust proxy");
PROD && app.use(slow());
app.use(cors());
app.use("/graphql", graphql());

app.get("/", (req, res) => res.send("https://jim-fx.github.io/plantarium"));

app.listen(PORT, () => console.log(`Plantarium server v:${version} running on port: ${PORT}`));
