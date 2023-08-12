import { extend } from 'umi-request';

const BASE_URL = 'https://cgx.camogearfinder.com';

const request = extend({
  prefix: BASE_URL,
  errorHandler: (error) => {
    console.error(error);
    throw error;
  },
});

export default request;
