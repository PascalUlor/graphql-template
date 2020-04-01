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
  };
