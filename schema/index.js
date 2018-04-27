const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');
const UserType = require('./types/user');
const pgdb = require('../database/pgdb');

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    me: {
      type: UserType,
      description: 'The current user indentified by api key',
      args: {
        key: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: (obj, args, {pgPool}) => {
        // obj is usually null for root fields
        // args are the arguments passed to filter data, we can use args.key
        // 3rd argument is context
        return pgdb(pgPool).getUserByApiKey(args.key);
      }
    }
  }
});

const ncSchema = new GraphQLSchema({
  query: RootQueryType
});

module.exports = ncSchema;