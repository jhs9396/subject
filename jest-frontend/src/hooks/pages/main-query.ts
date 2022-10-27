import { generateGqlQuery } from 'helper/recycle';
import { ISendGql } from 'helper/gql-type';

export const queryMainGraph = (): ISendGql => {
  return generateGqlQuery({
    gqlQueryType: 'query',
    operationName: 'Graph',
    queryArguments: [],
    queryFields: [
      {
        fieldName: 'nodes',
        children: [{ fieldName: 'label' }, { fieldName: 'name' }, { fieldName: 'radius' }, { fieldName: 'color' }]
      },
      { fieldName: 'edges', children: [{ fieldName: 'source' }, { fieldName: 'target' }] }
    ],
    variables: {}
  });
};
