/**
 * arguments in the function signature of a GraphQL resolver:
 * (parent, args, context, info) => { ... }
 */
export default {
    /**
     * default resolvers (Implicit Resolvers)
     */
    Query: {
      me: (parent, args, { me }) => {
        return me;
      },
      user: (parent, { id }, { models }) => {
        return models.users[id];
      },
      users: (parent, args, { models }) => {
        return Object.values(models.users);
      }
    },
    /**
     * Explicit Resolvers
     */
    User: {
      username: (user, args, { models }) => {
        // console.log(parent, '<<<<<<<<<')
        return `Name is ${user.username} age is ${user.age}`;
      },
      messages: (user, args, { models }) => {
          return Object.values(models.messages).filter(
            msg => msg.userId === user.id,
          );
        },
    },
  };
