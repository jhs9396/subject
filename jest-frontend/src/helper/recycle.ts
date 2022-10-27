import { IArgument, IField, IGenerateGqlQuery, ISendGql } from './gql-type';

export const generateGqlQuery = (args: IGenerateGqlQuery): ISendGql => {
  const { operationName, queryArguments, queryFields, variables, gqlQueryType } = args;

  const upperOperationName = textToUpperCase(operationName);
  const lowerOperationName = textToLowerCase(operationName);

  const field = factorialFields(queryFields);

  let query = '';

  if (queryArguments.length > 0 && queryFields.length > 0) {
    query = `${gqlQueryType}
              ${upperOperationName}(${generateArguments(queryArguments)}) {
                  ${lowerOperationName}(${generateInputs(queryArguments)}) {
                    ${field}
                  }
              }
           `;
  } else if (queryFields.length === 0 && queryArguments.length > 0) {
    query = `${gqlQueryType}
              ${upperOperationName}(${generateArguments(queryArguments)}) {
                  ${lowerOperationName}(${generateInputs(queryArguments)}) 
              }
           `;
  } else {
    query = `${gqlQueryType}
              ${upperOperationName} {
                  ${lowerOperationName} {
                    ${field}
                  }
              }
           `;
  }

  const resultMakeQuery: ISendGql = {
    operationName: upperOperationName,
    query,
    variables
  };
  return resultMakeQuery;
};

export const textToUpperCase = (arg: string): string => {
  return arg.charAt(0).toUpperCase() + arg.slice(1);
};

export const textToLowerCase = (arg: string): string => {
  return arg.charAt(0).toLowerCase() + arg.slice(1);
};

const factorialFields = (queryFields: IField[]): string => {
  let result = '';
  const reduceFields = queryFields.reduce((acc, cur) => {
    if (cur.children) {
      const fieldQuery = cur.children.reduce((cAcc, cCur) => {
        if (!cCur.children) {
          cAcc.push(cCur.fieldName);
          return cAcc;
        }
        cAcc.push(`${cCur.fieldName}{${factorialFields(cCur.children)}}`);
        return cAcc;
      }, []);
      acc.push(`${cur.fieldName} { ${fieldQuery.toString().replace(/,/gi, ' ')} }`);
    } else {
      acc.push(cur.fieldName);
    }
    return acc;
  }, []);

  if (reduceFields.length === 0) {
    result = reduceFields.toString();
  } else {
    result = reduceFields.toString().replace(/,/gi, ' \n');
  }

  return result;
};

const generateArguments = (queryArguments: IArgument[]) => {
  const resultString = queryArguments.reduce((acc, cur) => {
    const arg = `$${cur.keyName}: ${cur.type}${cur.required === 'N' ? '' : '!'}`;
    acc.push(arg);
    return acc;
  }, []);
  return resultString.toString();
};

const generateInputs = (queryArguments: IArgument[]) => {
  const resultString = queryArguments.reduce((acc, cur) => {
    const arg = `${cur.keyName}: $${cur.keyName}`;
    acc.push(arg);
    return acc;
  }, []);
  return resultString.toString();
};
