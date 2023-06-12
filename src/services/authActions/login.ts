/* eslint-disable */
import { request, history } from 'umi';
import { unAuthRoutes } from '../../constants/common.constants';
import { message } from 'antd';
import { clearStorage } from '../../utils/storage';

export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function user(body: any, options?: { [key: string]: any }) {
  return request<any>('/api/home', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token: `${body.token}`,
    },
    ...(options || {}),
  });
}

export async function emailVarification(body: any, options?: { [key: string]: any }) {
  return request<any>(`/api/emailvalidation/${body.token}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export const InvalidToken = () => {
  message.error('Token is invalid or expire!');
  clearStorage();
  history.push(unAuthRoutes[0]);
};
