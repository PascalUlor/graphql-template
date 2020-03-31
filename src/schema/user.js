import { gql } from 'apollo-server-express';

export default gql`
extend type Query {
    me: User
    user(id: ID!): User
    users: [User!]
  }
  type User {
    id: ID!
    username: String!
    age: Int!
    hobbies: Hobbies
    messages: [Message!]
  }
  type Hobbies {
    default: String!
    fav: String
    fav2: String
  }
`;
