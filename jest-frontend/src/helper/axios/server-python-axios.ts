import axios, { AxiosRequestConfig } from 'axios';

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
  baseURL: process.env.REACT_APP_PYTHON_API_SERVER_HOST,
  timeout: 60000
});

export default service;
