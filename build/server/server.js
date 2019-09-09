'use strict';

var express = require('express');

var express_graphql = require('express-graphql');

var _require = require('graphql'),
    buildSchema = _require.buildSchema; // GraphQL schema


var schema = buildSchema("\n    type Query {\n        message: String\n    }\n"); // Root resolver

var root = {
  message: function message() {
    return 'Hello World!';
  }
}; // Create an express server and a GraphQL endpoint

var app = express();
app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}));
app.listen(4000, function () {
  return console.log('Express GraphQL Server Now Running On localhost:4000/graphql');
});
