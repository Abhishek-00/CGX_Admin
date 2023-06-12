/* eslint-disable */
import { request } from 'umi';

export async function register(body: API.RegisterParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
