import { expect } from 'chai';
import * as userApi from './api';

describe('users', () => {
    describe('user(id: ID!): User', () => {
        it('return existing user if found', async () => {
            const expectedResult = {
                data: {
                    user: {
                        id: '1',
                        username: 'pascal',
                        email: 'pc@yahoo.com',
                        age: 30,
                        role: 'ADMIN',
                    },
                },
            };

            const result = await userApi.user({ id: '1' });
            // console.log(result.data, '<<<<<<<<')
            expect(result.data).to.eql(expectedResult);
        });

        it('returns null when user cannot be found', async () => {
            const expectedResult = {
              data: {
                user: null,
              },
            };
            const result = await userApi.user({ id: '42' });
            expect(result.data).to.eql(expectedResult);
          });
    });

    describe('deleteUser(id: ID!): Boolean', () => {
        it('returns error if user is not admin', async () => {
            const {
                data: {
                    data: {
                        signIn: { token },
                    },
                },
            } = await userApi.signIn({
                login: 'ddavids',
                password: 'pascal2',
            });
            const {
                data: { errors },
            } = await userApi.deleteUser({ id: '1' }, token);
            expect(errors[0].message).to.eql('Not auth admin')
        });
    });
});