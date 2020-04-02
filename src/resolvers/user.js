import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import { isAdmin } from './authorization';



const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, { expiresIn });
};

/**
 * arguments in the function signature of a GraphQL resolver:
 * (parent, args, context, info) => { ... }
 */
export default {
    /**
     * default resolvers (Implicit Resolvers)
     */
    Query: {
      me: async (parent, args, { models, me }) => {
          if (!me) {
              return null;
          }
        return await models.User.findByPk(me.id);
      },
      user: async (parent, { id }, { models }) => {
        return await models.User.findByPk(id);
      },
      users: async (parent, args, { models }) => {
        return await models.User.findAll();
      }
    },
    /**
     * Explicit Resolvers
     */
    User: {
    //   username: (user, args, { models }) => {
    //     // console.log(parent, '<<<<<<<<<')
    //     return `Name is ${user.username} age is ${user.age}`;
    //   },
      messages: async (user, args, { models }) => {
          return await models.Message.findAll({
        where: {
          userId: user.id,
        },
      });
        },
    },
    Mutation: {
      signUp: async (
        parent,
        { username, email, password },
        { models, secret },
      ) => {
        const user = await models.User.create({
          username,
          email,
          password
        });
        return { token: createToken(user, secret, '1hr') };
      },

      signIn: async(parent, { login, password }, { models, secret }) => {
        const user = await models.User.findByLogin(login);

        if(!user) {
          throw new UserInputError('No user found with this login deets');
        }
        const isValid = await user.validatePassword(password);
        if(!isValid) {
          throw new AuthenticationError('Invalid password');
        }
        return {token: createToken(user, secret, '30m')};
      },

      deleteUser: combineResolvers(
        isAdmin,
        async(parent, { id }, { models }) => {
          return await models.User.destroy({
            where: { id },
          });
        },
      ),
    },  
  };
