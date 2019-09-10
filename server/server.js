const express = require("express");
const app = express();

const PROD = false;

PROD && app.use(require("helmet")());
PROD && app.enable("trust proxy");
PROD && app.use(require("express-slow-down")());
app.use(require("cors")());
app.use("/graphql", require("./graphql")())

app.listen(4000, () => console.log('Express GraphQL Server Now Running On http://localhost:4000/graphql'));