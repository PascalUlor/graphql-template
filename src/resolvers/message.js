// import uuidv4 from 'uuid/v4';
import { ForbiddenError } from 'apollo-server';
import Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';

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
          [Sequelize.Op.lt]: cursor,
        },
      }
    } : {};
        return await models.Message.findAll({
        order: [['createdAt', 'DESC']],
        limit,
        ...cursorOption
      });
      },
      message: async (parent, { id }, { models }) => {
        return await models.Message.findByPk(id);
      },
    },
    /**
     * Explicit Resolvers
     */
    
    Message: {
      user: async (message, args, { models }) => {
        return await models.User.findByPk(message.userId);
      },
    },
    Mutation: {
      createMessage: combineResolvers(
        isAuthenticated,
        async (parent, { text }, { me, models }) => {
          // const id = uuidv4();
          try{
              return await models.Message.create({
                  text,
                  userId: me.id,
                });
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
  };
