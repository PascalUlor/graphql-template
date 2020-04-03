import axios from 'axios';

const API_URL = 'http://localhost:8000/graphql';

export const user = async variables => {
    return axios.post(API_URL, {
        query: `
            query ($id: ID!) {
                user(id: $id){
                    id
                    username
                    email
                    age
                    role
                }
            }
            `,
        variables,
    });
};

export const signIn = async (variables) =>
    await axios.post(API_URL, {
        query:`
        mutation ($login: String!, $password: String!) {
            signIn (login: $login, password: $password) {
                token
            }
        }
        `,
        variables
    });

export const deleteUser = async (variables, token) =>
    await axios.post(API_URL, {
        query:`
        mutation($id: ID!) {
            deleteUser(id: $id) 
        }
        `,
        variables
        },
        { headers: {
            'x-token': token,
            },
        },
    );