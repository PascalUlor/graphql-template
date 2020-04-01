import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
  },
);

export { sequelize };

const models = {
    User: sequelize.import('./user'),
    Message: sequelize.import('./message'),
}

Object.keys(models).forEach(key => {
    if ('associate' in models[key]) {
        models[key].associate(models);
    }
});

export default models;

// let users = {
//     1: {
//       id: '1',
//       username: 'Joe West',
//       age: 30,
//       hobbies: {
//         default: 'Coding',
//         fav: 'Running',
//         fav2: 'Dancing',
//       },
//       messageIds: [1],
//     },
//     2: {
//       id: '2',
//       username: 'Pascal',
//       age: 60,
//       hobbies: {
//         default: 'Coding',
//         fav: 'Running',
//         fav2: 'Dancing',
//       },
//       messageIds: [2],
//     },
//   };
  
//   let messages = {
//     1: {
//       id: '1',
//       text: 'Hello World',
//       userId: '1',
//     },
//     2: {
//       id: '2',
//       text: 'By World',
//       userId: '2',
//     },
//   };

//   export default {
//       users,
//       messages,
//   }