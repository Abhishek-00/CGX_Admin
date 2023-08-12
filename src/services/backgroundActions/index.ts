/* eslint-disable */
import request from '../interceptor';
import { readData } from '../../utils/storage';
import {
  GET_BACKGROUND_ERROR,
  GET_BACKGROUND_REQUEST,
  GET_BACKGROUND_SUCCESS,
} from '../../constants/background.constants';
import { dispatch } from '../store';

const fetchBackgroundListRequest = () => ({ type: GET_BACKGROUND_REQUEST });
const fetchBackgroundListSuccess = (payload: any) => ({ type: GET_BACKGROUND_SUCCESS, payload });
const fetchBackgroundListFailure = (message: string) => ({ type: GET_BACKGROUND_ERROR, message });

async function getBackgroundsList(body: { [key: string]: any }, options?: { [key: string]: any }) {
  dispatch(fetchBackgroundListRequest());
  try {
    let accessToken = await readData('accessToken');
    const response = await request<API.LoginResult>('/background', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `${accessToken}`,
      },
      data: body,
      ...(options || {}),
    });
    dispatch(fetchBackgroundListSuccess(response.data));
    return response;
  } catch (error: any) {
    dispatch(fetchBackgroundListFailure(error.message));
    return error;
  }
}

async function getBackgroundById(
  id: number,
  body: { [key: string]: any },
  options?: { [key: string]: any },
) {
  try {
    let accessToken = await readData('accessToken');
    const response = await request<API.LoginResult>(`/background/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: `${accessToken}`,
      },
      data: body,
      ...(options || {}),
    });
    return response;
  } catch (error: any) {
    return error;
  }
}

async function createBackgrounds(body: { [key: string]: any }, options?: { [key: string]: any }) {
  let accessToken = await readData('accessToken');
  return request<API.LoginResult>('/background/create_background', {
    method: 'POST',
    headers: {
      token: `${accessToken}`,
    },
    data: body,
    ...(options || {}),
  });
}

async function updateBackgrounds(
  background_id: number | undefined,
  body: { [key: string]: any },
  options?: { [key: string]: any },
) {
  let accessToken = await readData('accessToken');
  return request<API.LoginResult>(`/background/update_background/${background_id}`, {
    method: 'PUT',
    headers: {
      token: `${accessToken}`,
    },
    data: body,
    ...(options || {}),
  });
}

async function removeBackgrounds(data: { key: number[] }, options?: { [key: string]: any }) {
  let accessToken = await readData('accessToken');
  return request<Record<string, any>>('/background/delete_background', {
    data,
    method: 'DELETE',
    headers: {
      token: `${accessToken}`,
    },
    ...(options || {}),
  });
}

async function getBackgroundImage(url: string) {
  let accessToken = await readData('accessToken');
  return request<Record<string, any>>(`/background/image${url}`, {
    method: 'GET',
    headers: {
      token: `${accessToken}`,
    },
  });
}

export default {
  getBackgroundsList,
  getBackgroundById,
  createBackgrounds,
  updateBackgrounds,
  removeBackgrounds,
  getBackgroundImage,
};
