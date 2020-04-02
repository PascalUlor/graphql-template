import express from 'express';
import http from 'http';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import models, { sequelize } from './models';
import schema from './schema';
import resolvers from './resolvers';

dotenv.config()

const app = express();
app.use(cors());

const getMe = async req => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired'
      );
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');
    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
    // me: await models.User.findByLogin('pascal'),
    if (connection) {
      return {
        models
      }
    }
    if(req) {
      const me = await getMe(req);
      return {
      models,
      me,
      secret: process.env.SECRET
    };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// const eraseDatabaseOnSync = true;

const isTest = !!process.env.TEST_DB;

sequelize.sync({ force: isTest }).then(async () => {
  if (isTest) {
    createUsersWithMessages(new Date());
  }
  httpServer.listen({ port: 8000 }, () => {
    console.log('Apollo sever up on http://localhost:8000/graphql');
  });
});

const createUsersWithMessages = async (date) => {
  await models.User.create(
    {
      username: 'pascal',
      email: 'pc@yahoo.com',
      password: 'pascal1',
      age: 30,
      role: 'ADMIN',
      messages: [
        {
          text: 'Published the Road to learn React',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
  await models.User.create(
    {
      username: 'ddavids',
      email: 'donpc@yahoo.com',
      password: 'pascal2',
      age: 42,
      messages: [
        {
          text: 'Happy to release ...',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
        {
          text: 'Published a complete ...',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};