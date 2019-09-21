const graphql = require("graphql");
const { GraphQLDate } = require("graphql-iso-date");
const BigInt = require("graphql-bigint");
const db = require("../database");

const plantMetaInputType = new graphql.GraphQLInputObjectType({
  name: "PlantMetaInput",
  fields: {
    name: { type: graphql.GraphQLString },
    lastSaved: { type: BigInt }
  }
});

const plantMetaInfoType = new graphql.GraphQLObjectType({
  name: "PlantMetaInfo",
  fields: {
    name: { type: graphql.GraphQLString },
    plantariumVersion: { type: graphql.GraphQLString },
    seed: { type: graphql.GraphQLString },
    randomSeed: { type: graphql.GraphQLString },
    lastSaved: { type: BigInt },
    author: { type: graphql.GraphQLString },
    latinName: { type: graphql.GraphQLString },
    family: { type: graphql.GraphQLString },
    class: { type: graphql.GraphQLString }
  }
});

const plantType = new graphql.GraphQLObjectType({
  name: "Plant",
  fields: {
    meta: {
      type: plantMetaInfoType,
      args: {
        author: { type: graphql.GraphQLString }
      }
    }
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

const mutationType = new graphql.GraphQLObjectType({
  name: "Mutation",
  fields: {
    user: {
      type: userType,
      resolve: db.createUser
    },
    getUpdatedPlants: {
      type: plantType,
      args: {
        author: { type: graphql.GraphQLString },
        plants: {
          type: new graphql.GraphQLList(plantMetaInputType)
        }
      }
    }
  }
});

const schema = new graphql.GraphQLSchema({ query: queryType, mutation: mutationType });

module.exports = schema;
