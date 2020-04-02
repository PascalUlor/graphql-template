import { ForbiddenError } from 'apollo-server';
import { skip, combineResolvers } from 'graphql-resolvers';

export const isAuthenticated = (parent, args, { me }) =>{
    console.log(me, '<<<<<<<<<<');
me ? skip: new ForbiddenError('Not allowed');
}
export const isMessageOwner = async (parent, { id }, { models, me },) => {
    const message = await models.Message.findByPk(id, { raw: true });

    if (message.userId !== me.id) {
        throw new ForbiddenError('Not auth owner');
    }
    return skip;
}

export const isAdmin = combineResolvers(
    isAuthenticated,
    (parent, args, { me: { role }}) => {
        role === 'ADMIN'
        ? skip : new ForbiddenError('Not auth admin');
    }
)