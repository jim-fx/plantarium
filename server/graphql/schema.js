const graphql = require("graphql");
const { GraphQLDate } = require("graphql-iso-date");
const { getPlant, getPlants } = require("../database");
const uuid = require("uuid/v4");

const plantMetaInfoType = new graphql.GraphQLObjectType({
  name: "PlantMetaInfo",
  fields: {
    name: { type: graphql.GraphQLString },
    plantariumVersion: { type: graphql.GraphQLString },
    seed: { type: graphql.GraphQLString },
    randomSeed: { type: graphql.GraphQLString },
    lastSaved: { type: GraphQLDate },
    author: { type: graphql.GraphQLID },
    latinName: { type: graphql.GraphQLString },
    family: { type: graphql.GraphQLString },
    class: { type: graphql.GraphQLString }
  }
});

const plantType = new graphql.GraphQLObjectType({
  name: "Plant",
  fields: {
    meta: { type: plantMetaInfoType }
  }
});

const userType = new graphql.GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString }
  }
});

const queryType = new graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    plant: {
      type: plantType,
      args: {
        id: { type: graphql.GraphQLString }
      }
    },
    plants: {
      type: plantType,
      args: {
        author: { type: graphql.GraphQLString }
      }
    },
    user: {
      type: userType,
      args: {
        id: { type: graphql.GraphQLString }
      }
    }
  }
});

const schema = new graphql.GraphQLSchema({ query: queryType });

module.exports = schema;
