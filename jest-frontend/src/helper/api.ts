import { AxiosResponse } from 'axios';
import serverAxios from 'helper/axios/server-axios';
import { ISendGql } from 'helper/gql-type';

export const sendApi = (data: ISendGql): Promise<AxiosResponse> =>
  serverAxios({ url: '/graphql', method: 'post', data });
