import express_graphql from "express-graphql";
import * as db from "../database";
import { GraphQLSchema, buildSchema } from "graphql";

import s from "./schema.graphql";

export default () =>
  express_graphql({
    schema: buildSchema(s.loc.source.body),
    rootValue: {
      plants: db.getPlants,
      plant: db.getPlant,
      user: db.getUser,
      createUser: db.createUser,
      getUpdatedPlants: db.getUpdatedPlants
    },
    graphiql: true
  });
