// import uuidv4 from 'uuid/v4';
import { ForbiddenError } from 'apollo-server';
import Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';
import pubsub, { EVENTS } from '../subscription';


const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string => Buffer.from(string, 'base64').toString('ascii');
/**
 * arguments in the function signature of a GraphQL resolver:
 * (parent, args, context, info) => { ... }
 */
export default {
    /**
     * default resolvers (Implicit Resolvers)
     */
    Query: {
      messages: async (parent, { cursor, limit = 100 }, { models }) => {
        const cursorOption = cursor
        ? {
          where: { createdAt: {
          [Sequelize.Op.lt]: fromCursorHash(cursor),
        },
      }
    } : {};
        const messages = await models.Message.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOption
      });

      const hasNextPage = messages.length > limit;
      const edges = hasNextPage ? messages.slice(0, -1) : messages;

      return {
        edges,
        pageInfo: {
          endCursor: toCursorHash(
            edges[edges.length - 1].createdAt.toString(),
            ),
        },
      }
      },
      message: async (parent, { id }, { models }) => {
        return await models.Message.findByPk(id);
      },
    },
    /**
     * Explicit Resolvers
     */
    
    Message: {
      user: async (message, args, { models,loaders }) => {
        // return await models.User.findByPk(message.userId);
        return await loaders.user.load(message.userId)
      },
    },
    Mutation: {
      createMessage: combineResolvers(
        isAuthenticated,
        async (parent, { text }, { me, models }) => {
          // const id = uuidv4();
          try{
              const message = await models.Message.create({
                  text,
                  userId: me.id,
                });
                pubsub.publish(EVENTS.MESSAGE.CREATED, { 
                  messageCreated: { message },
                });
              return message;
          } catch(err) {
              throw new Error(err);
          }
          
        }
      ),
      deleteMessage: combineResolvers(
        isAuthenticated,
        isMessageOwner,
        async (parent, { id }, { models }) => {
          return await models.Message.destroy({ where: { id } });
        },
      )
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
      }
    }
  };
