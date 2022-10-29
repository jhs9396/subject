import { AxiosResponse } from 'axios';
import serverAxios from 'helper/axios/server-axios';
import serverPythonAxios from 'helper/axios/server-python-axios';
import { ISendGql } from 'helper/gql-type';

export const sendApi = (data: ISendGql): Promise<AxiosResponse> =>
  serverAxios({ url: '/graphql', method: 'post', data });

export const sendPythonApi = (
  url: string,
  method: any,
  // eslint-disable-next-line default-param-last
  headers = {},
  data: JavascriptObject
): Promise<AxiosResponse> => serverPythonAxios({ url, method, headers, data });
