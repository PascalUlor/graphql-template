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
}