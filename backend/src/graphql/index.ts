import express_graphql from "express-graphql";
import * as resolver from "../resolvers";
import { buildSchema } from "graphql";

import s from "./schema.graphql";

export default () =>
  express_graphql({
    schema: buildSchema(s.loc.source.body),
    rootValue: resolver,
    graphiql: true
  });
