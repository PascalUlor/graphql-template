import uuidv4 from 'uuid/v4';

/**
 * arguments in the function signature of a GraphQL resolver:
 * (parent, args, context, info) => { ... }
 */
export default {
    /**
     * default resolvers (Implicit Resolvers)
     */
    Query: {
      messages: (parent, args, { models }) => {
        return Object.values(models.messages);
      },
      message: (parent, { id }, { models }) => {
        return models.messages[id];
      },
    },
    /**
     * Explicit Resolvers
     */
    
    Message: {
      user: (message, args, { models }) => {
        return models.users[message.userId];
      },
    },
    Mutation: {
      createMessage: (parent, { text }, { me, models }) => {
        const id = uuidv4();
        const message = {
          id,
          text,
          userId: me.userId
        };
        models.messages[id] = message;
        models.users[me.id].messageIds.push(id);
  
        return message;
      },
      deleteMessage: (parent, { id }, { models }) => {
        const { [id]: message, ...otherMessages } = models.messages;
        if(!message) {
          return false;
        }
        models.messages = otherMessages;
        return true;
      },
      updateMessage: (parent, { id, text }, { models}) => {
        const { [id]: message, ...otherMessages } = models.messages;
        if(message) {
          message.text = text;
        }
        return message;
      }
    },
  };
