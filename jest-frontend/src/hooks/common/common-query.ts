import { ISendGql } from 'helper/gql-type';
import { generateGqlQuery } from 'helper/recycle';

export const queryGenerateToken = (id: string): ISendGql => {
  return generateGqlQuery({
    gqlQueryType: 'mutation',
    operationName: 'generateToken',
    queryArguments: [{ keyName: 'id', type: 'String' }],
    queryFields: [{ fieldName: 'accessToken' }, { fieldName: 'exp' }],
    variables: { id }
  });
};
