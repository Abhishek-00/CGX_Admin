import { extend } from 'umi-request';
import { InvalidToken } from './authActions/login';

const request = extend({
  errorHandler: (error) => {
    console.error(error);
    throw error;
  },
});

request.interceptors.response.use(async (response) => {
  if (response.status === 401) {
    InvalidToken();
  }
  return response;
});

export default request;
