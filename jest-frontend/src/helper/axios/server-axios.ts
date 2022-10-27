import axios, { AxiosRequestConfig } from 'axios';
import { generateGqlQuery } from 'helper/recycle';

declare module 'axios' {
  export interface AxiosResponse<T = any> extends Promise<T> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    errors: any;
    config: AxiosRequestConfig;
    request?: any;
  }
}

const service = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER_HOST,
  withCredentials: true,
  timeout: 60000
});

service.interceptors.request.use(
  config => {
    config.headers.Authorization = `Bearer ${sessionStorage.getItem('accessToken')}`;
    return config;
  },
  error => {
    Promise.reject(error).then();
    return { error };
  }
);

// service.interceptors.response.use(
//   async response => {
//     const { data, config } = response;
//     if (
//       data.errors &&
//       data.errors[0].code === 401 &&
//       sessionStorage.getItem('refreshToken') !== null &&
//       sessionStorage.getItem('token') !== null
//     ) {
//       const originalRequest = config;
//       const headerConfig = {
//         headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
//       };
//       const payload = generateGqlQuery({
//         gqlQueryType: 'query',
//         operationName: 'AdminLoginByRefreshToken',
//         queryArguments: [{ keyName: 'refreshToken', type: 'String' }],
//         queryFields: [{ fieldName: 'token' }, { fieldName: 'refreshToken' }],
//         variables: { refreshToken: sessionStorage.getItem('refreshToken') }
//       });
//       const response = await axios.post(`${process.env.REACT_APP_API_SERVER_HOST}/graphql`, payload, headerConfig);
//       const { data, errors = [] } = response.data;
//       if (errors.length > 0) {
//         sessionStorage.removeItem('token');
//         sessionStorage.removeItem('refreshToken');
//         window.location.reload();
//       } else {
//         sessionStorage.setItem('token', data.adminLoginByRefreshToken.token);
//         sessionStorage.setItem('refreshToken', data.adminLoginByRefreshToken.refreshToken);
//
//         originalRequest.headers.Authorization = `Bearer ${sessionStorage.getItem('token')}`;
//         const originalResponse = await axios(originalRequest);
//
//         return originalResponse.data;
//       }
//     }
//
//     return data;
//   },
//   error => {
//     if (error.response.status === 406) {
//       console.error('406 error');
//     }
//     return { data: null, errors: error?.response?.data?.errors };
//   }
// );

export default service;
