export declare type GqlQueryType = 'query' | 'mutation';

export type ISendGql = {
  operationName: string;
  query: string;
  variables: JSONObject;
};

export type IField = {
  fieldName: string;
  children?: IField[];
};

export type IArgument = {
  keyName: string;
  type: string;
  required?: 'Y' | 'N';
};

export type IGenerateGqlQuery = {
  operationName: string;
  queryArguments: IArgument[];
  queryFields: IField[];
  variables: JSONObject;
  gqlQueryType: GqlQueryType;
};
