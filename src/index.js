import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import models from './models';
import schema from './schema';
import resolvers from './resolvers';

const app = express();
app.use(cors());

// const me = users[1]

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models,
    me: models.users[1],
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo sever up on http://localhost:8000/graphql');
});
