import { gql } from 'apollo-server-express';
import userSchema from './user';
import messageSchema from './message';

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
`;

export default [linkSchema, userSchema, messageSchema]


// import { gql } from 'apollo-server-express';

// export default gql`
//   type Query {
//     me: User
//     user(id: ID!): User
//     users: [User!]

//     messages: [Message!]!
//     message(id: ID!): Message!
//   }
//   type User {
//     id: ID!
//     username: String!
//     age: Int!
//     hobbies: Hobbies
//     messages: [Message!]
//   }
//   type Hobbies {
//     default: String!
//     fav: String
//     fav2: String
//   }
//   type Message {
//     id: ID!
//     text: String!
//     user: User!
//   }

//   type Mutation {
//     createMessage(text: String!): Message!
//     deleteMessage(id: ID!): Boolean!
//     updateMessage(id: ID!, text: String!): Message!
//   }
// `;
