// import uuidv4 from 'uuid/v4';

/**
 * arguments in the function signature of a GraphQL resolver:
 * (parent, args, context, info) => { ... }
 */
export default {
    /**
     * default resolvers (Implicit Resolvers)
     */
    Query: {
      messages: async (parent, args, { models }) => {
        return await models.Message.findAll();
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
      createMessage: async (parent, { text }, { me, models }) => {
        // const id = uuidv4();
        return await models.Message.create({
            text,
            userId: me.id,
          });
      },
      deleteMessage: async (parent, { id }, { models }) => {
        return await models.Message.destroy({ where: { id } });
      },
    //   updateMessage: (parent, { id, text }, { models}) => {
    //     const { [id]: message, ...otherMessages } = models.messages;
    //     if(message) {
    //       message.text = text;
    //     }
    //     return message;
    //   }
    },
  };
