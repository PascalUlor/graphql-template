// import uuidv4 from 'uuid/v4';
import { ForbiddenError } from 'apollo-server';
import Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';
import pubsub, { EVENTS } from '../subscription';
import { promisify } from 'util';

const toCursorHash = (string) =>
  Buffer.from(string).toString('base64');
const fromCursorHash = (string) =>
  Buffer.from(string, 'base64').toString('ascii');
/**
 * arguments in the function signature of a GraphQL resolver:
 * (parent, args, context, info) => { ... }
 */
export default {
  /**
   * default resolvers (Implicit Resolvers)
   */
  Query: {
    messages: async (
      parent,
      { cursor, limit = 100 },
      { models, client },
    ) => {
      const cursorOption = cursor
        ? {
            where: {
              createdAt: {
                [Sequelize.Op.lt]: fromCursorHash(cursor),
              },
            },
          }
        : {};
        const lRangeAsync = promisify(client.lrange).bind(client);
        const check = await lRangeAsync('Message', 0, -1);
        // console.log(check, '<<<<<<<<<<<')
        if (check.length === 0) {
          const messages = await models.Message.findAll({
            order: [['createdAt', 'DESC']],
            limit: limit + 1,
            ...cursorOption,
          });
    
          await client.del('Message');
          const messagesList = messages.map((x) => JSON.stringify(x));
          await client.lpush('Message', ...messagesList);
    
          // Convert to error first sync function to an assync function
          // const lRangeAsync = promisify(client.lrange).bind(client);
          const allMessages = await lRangeAsync('Message', 0, -1);
    
          const data = allMessages.map((x) => JSON.parse(x));
    
          console.log(data, '<<<<<<<<<< Redis Cache<<<<<<<');
          const hasNextPage = data.length > limit;
          const edges = hasNextPage ? data.slice(0, -1) : data;
    
          return {
            edges,
            pageInfo: {
              endCursor: toCursorHash(
                edges[edges.length - 1].createdAt.toString(),
              ),
            },
          };
        }

        // Convert to error first sync function to an assync function
        // const lRangeAsync = promisify(client.lrange).bind(client);
        const allMessages = await lRangeAsync('Message', 0, -1);
  
        const data = allMessages.map((x) => JSON.parse(x));
        console.log(data, '<<<<<<<<<< Get From Redis Cache<<<<<<<');
        const hasNextPage = data.length > limit;
        const edges = hasNextPage ? data.slice(0, -1) : data;
  
        return {
          edges,
          pageInfo: {
            endCursor: toCursorHash(
              edges[edges.length - 1].createdAt.toString(),
            ),
          },
        };
      
    },
    message: async (parent, { id }, { models }) => {
      return await models.Message.findByPk(id);
    },
  },
  /**
   * Explicit Resolvers
   */

  Message: {
    user: async (message, args, { models, loaders }) => {
      // return await models.User.findByPk(message.userId);
      return await loaders.user.load(message.userId);
    },
  },
  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { me, models, client }) => {
        // const id = uuidv4();
        try {
          const message = await models.Message.create({
            text,
            userId: me.id,
          });
          pubsub.publish(EVENTS.MESSAGE.CREATED, {
            messageCreated: { message },
          });

          const newMessage = JSON.stringify(message);
          await client.lpush('Message', newMessage);
          return message;
        } catch (err) {
          throw new Error(err);
        }
      },
    ),
    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { models }) => {
        return await models.Message.destroy({ where: { id } });
      },
    ),
    //   updateMessage: (parent, { id, text }, { models}) => {
    //     const { [id]: message, ...otherMessages } = models.messages;
    //     if(message) {
    //       message.text = text;
    //     }
    //     return message;
    //   }
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
    },
  },
};
