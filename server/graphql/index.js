const express_graphql = require("express-graphql");
const { buildSchema } = require("graphql");

const { getPlant, getPlants } = require("../database");

// GraphQL schema
const schema = buildSchema(`
    type Query {
        plant(id: Int!): Plant
        plants(topic: String): [Plant]
    },
    type Plant {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);
// Root resolver
const root = {
  plant: getPlant,
  plants: getPlants
};

module.exports = () =>
  express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
  });
