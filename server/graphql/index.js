const express_graphql = require("express-graphql");
const db = require("../database");

module.exports = () =>
  express_graphql({
    schema: require("./schema"),
    rootValue: {
      plants: db.getPlants,
      plant: db.getPlant,
      user: db.getUser,
      createUser: db.createUser
    },
    graphiql: true
  });
