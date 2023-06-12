/* eslint-disable */
import { readData } from '../../../utils/storage';
import request from '../../interceptor';

async function getUserType(options?: { [key: string]: any }) {
  let accessToken = await readData('accessToken');
  return await request('/api/configuration/usertypes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: `${accessToken}`,
    },
    ...(options || {}),
  });
}

async function createUserType(body: { [key: string]: any }, options?: { [key: string]: any }) {
  let accessToken = await readData('accessToken');
  return await request<API.LoginResult>('/api/configuration/add_usertype', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: `${accessToken}`,
    },
    data: body,
    ...(options || {}),
  });
}

async function updateUserType(body: { [key: string]: any }, options?: { [key: string]: any }) {
  let accessToken = await readData('accessToken');
  return await request<API.LoginResult>(`/api/configuration/update_usertype/${body.Usertype_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      token: `${accessToken}`,
    },
    data: body,
    ...(options || {}),
  });
}

async function removeUserType(data: number[], options?: { [key: string]: any }) {
  let accessToken = await readData('accessToken');
  return request<Record<string, any>>('/api/configuration/delete_usertypes', {
    headers: {
      token: `${accessToken}`,
    },
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

export default {
  getUserType,
  createUserType,
  updateUserType,
  removeUserType,
};
