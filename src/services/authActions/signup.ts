/* eslint-disable */
import request from '@/utils/request';

export async function register(body: API.RegisterParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
