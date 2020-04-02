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
            console.log(result.data, '<<<<<<<<')
            expect(result.data).to.eql(expectedResult);
        });
    });
});