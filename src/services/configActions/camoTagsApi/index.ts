/* eslint-disable */
import { readData } from '../../../utils/storage';
import request from '../../interceptor';

async function getCamoTags(options?: { [key: string]: any }) {
  let accessToken = await readData('accessToken');
  return await request('/camos/mastercamotags', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token: `${accessToken}`,
    },
    ...(options || {}),
  });
}

async function creatCamoTag(body: { [key: string]: any }, options?: { [key: string]: any }) {
  let accessToken = await readData('accessToken');
  return await request<API.LoginResult>('/camos/addmastercamotags', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: `${accessToken}`,
    },
    // data: body,
    ...(options || {}),
  });
}

async function updateCamoTag(body: { [key: string]: any }, options?: { [key: string]: any }) {
  let accessToken = await readData('accessToken');
  return await request<API.LoginResult>(`/camos/updatemastercamotags`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      token: `${accessToken}`,
    },
    // data: body,
    ...(options || {}),
  });
}

async function removeCamoTag(data: number[], options?: { [key: string]: any }) {
  let accessToken = await readData('accessToken');
  return request<Record<string, any>>('/camos/deletemastercamotags', {
    headers: {
      token: `${accessToken}`,
    },
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

export default {
  getCamoTags,
  creatCamoTag,
  updateCamoTag,
  removeCamoTag,
};
