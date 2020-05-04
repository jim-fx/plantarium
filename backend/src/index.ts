import express from "express";
import helmet from "helmet";
import slow from "express-slow-down";
import cors from "cors";
import graph from "./graphql";

const app = express();

const PROD = false;
const PORT = process.env.PORT || 4000;

PROD && app.use(helmet());
PROD && app.enable("trust proxy");
PROD && app.use(slow({}));
app.use(cors());
app.use("/graphql", graph());

app.get("/", (req, res) => {
  res.send("https://jim-fx.github.io/plantarium");
});

app.listen(PORT, () => console.log("Express GraphQL Server Now Running"));
