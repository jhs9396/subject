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
        children: [
          { fieldName: 'id' },
          { fieldName: 'label' },
          { fieldName: 'name' },
          { fieldName: 'radius' },
          { fieldName: 'color' }
        ]
      },
      { fieldName: 'edges', children: [{ fieldName: 'source' }, { fieldName: 'target' }] }
    ],
    variables: {}
  });
};

export const queryMainGraphExpand = (requestGraph): ISendGql => {
  return generateGqlQuery({
    gqlQueryType: 'query',
    operationName: 'GraphExpand',
    queryArguments: [{ keyName: 'graphInput', type: 'GraphInput' }],
    queryFields: [
      {
        fieldName: 'nodes',
        children: [
          { fieldName: 'id' },
          { fieldName: 'label' },
          { fieldName: 'name' },
          { fieldName: 'radius' },
          { fieldName: 'color' }
        ]
      },
      { fieldName: 'edges', children: [{ fieldName: 'source' }, { fieldName: 'target' }] }
    ],
    variables: {
      graphInput: requestGraph
    }
  });
};
