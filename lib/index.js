const {nodeEnv} = require('./util');
console.log(`Running in ${nodeEnv} mode...`);

const pg = require('pg');
const pgConfig = require('../config/pg')[nodeEnv];
const pgPool = new pg.Pool(pgConfig);

const ncSchema = require('../schema');
const express = require('express');
const graphqlHTTP = require('express-graphql');

const {MongoClient} = require('mongodb');
const assert = require('assert');
const mConfig = require('../config/mongo')[nodeEnv];

MongoClient.connect(mConfig.url, (err, mPool) => {
  assert.equal(err, null);

  const app = express();
  app.use('/graphql', graphqlHTTP({
    schema: ncSchema,
    graphiql: true,
    context: {pgPool, mPool}
  }));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});