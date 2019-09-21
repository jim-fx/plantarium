const express = require("express");
const app = express();

const PROD = false;
const PORT = process.env.PORT || 4000;

PROD && app.use(require("helmet")());
PROD && app.enable("trust proxy");
PROD && app.use(require("express-slow-down")());
app.use(require("cors")());
app.use("/graphql", require("./graphql")());

app.get("/", (req, res) => res.send("https://jim-fx.github.io/plantarium"));

app.listen(PORT, () => console.log("Express GraphQL Server Now Running"));
