import { GraphQLDateTime } from 'graphql-iso-date';
import userResolver from './user';
import messageResolver from './message';

const customeScalarResolver = {
    Date: GraphQLDateTime,
}
export default [userResolver, messageResolver, customeScalarResolver];

// import uuidv4 from 'uuid/v4';

// /**
//  * arguments in the function signature of a GraphQL resolver:
//  * (parent, args, context, info) => { ... }
//  */
// export default {
//     /**
//      * default resolvers (Implicit Resolvers)
//      */
//     Query: {
//       me: (parent, args, { me }) => {
//         return me;
//       },
//       user: (parent, { id }, { models }) => {
//         return models.users[id];
//       },
//       users: (parent, args, { models }) => {
//         return Object.values(models.users);
//       },
//       messages: (parent, args, { models }) => {
//         return Object.values(models.messages);
//       },
//       message: (parent, { id }, { models }) => {
//         return models.messages[id];
//       },
//     },
//     /**
//      * Explicit Resolvers
//      */
//     User: {
//       username: (user, args, { models }) => {
//         // console.log(parent, '<<<<<<<<<')
//         return `Name is ${user.username} age is ${user.age}`;
//       },
//       messages: (user, args, { models }) => {
//           return Object.values(models.messages).filter(
//             msg => msg.userId === user.id,
//           );
//         },
//     },
//   //   User: {
//   //     messages: parent => {
//   //       return Object.values(messages).filter(
//   //         msg => msg.userId === parent.id,
//   //       );
//   //     },
//   //   },
//     Message: {
//       user: (message, args, { models }) => {
//         return models.users[message.userId];
//       },
//     },
//     Mutation: {
//       createMessage: (parent, { text }, { me, models }) => {
//         const id = uuidv4();
//         const message = {
//           id,
//           text,
//           userId: me.userId
//         };
//         models.messages[id] = message;
//         models.users[me.id].messageIds.push(id);
  
//         return message;
//       },
//       deleteMessage: (parent, { id }, { models }) => {
//         const { [id]: message, ...otherMessages } = models.messages;
//         if(!message) {
//           return false;
//         }
//         models.messages = otherMessages;
//         return true;
//       },
//       updateMessage: (parent, { id, text }, { models}) => {
//         const { [id]: message, ...otherMessages } = models.messages;
//         if(message) {
//           message.text = text;
//         }
//         return message;
//       }
//     },
//   };
