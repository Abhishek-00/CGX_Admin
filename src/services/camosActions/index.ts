/* eslint-disable */
import request from '../interceptor';
import { readData } from '../../utils/storage';
import { GET_CAMO_REQUEST, GET_CAMO_SUCCESS, GET_CAMO_ERROR } from '../../constants/camo.constants';
import { dispatch } from '../store';

const fetchCamoListRequest = () => ({ type: GET_CAMO_REQUEST });
const fetchCamoListSuccess = (payload: any) => ({ type: GET_CAMO_SUCCESS, payload });
const fetchCamoListFailure = (message: string) => ({ type: GET_CAMO_ERROR, message });

async function getCamosList(body: { [key: string]: any }, options?: { [key: string]: any }) {
  dispatch(fetchCamoListRequest());
  try {
    let accessToken = await readData('accessToken');
    const response = await request<API.LoginResult>('/camos/camos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `${accessToken}`,
      },
      data: body,
      ...(options || {}),
    });
    if (response) dispatch(fetchCamoListSuccess(response.data[0]));
    return response;
  } catch (e: any) {
    dispatch(fetchCamoListFailure(e));
    return e;
  }
}

async function createCamos(body: { [key: string]: any }, options?: { [key: string]: any }) {
  let accessToken = await readData('accessToken');
  return request<API.LoginResult>('/camos/addnewcamo/', {
    method: 'POST',
    headers: {
      token: `${accessToken}`,
    },
    data: body,
    ...(options || {}),
  });
}

async function updateCamos(
  camo_id: number | undefined,
  body: { [key: string]: any },
  options?: { [key: string]: any },
) {
  let accessToken = await readData('accessToken');
  return request<API.LoginResult>(`/camos/updatecamo/${camo_id}`, {
    method: 'PUT',
    headers: {
      token: `${accessToken}`,
    },
    data: body,
    ...(options || {}),
  });
}

async function removeCamos(data: { key: number[] }, options?: { [key: string]: any }) {
  let accessToken = await readData('accessToken');
  return request<Record<string, any>>('/camos/delete_camo', {
    data,
    method: 'DELETE',
    headers: {
      token: `${accessToken}`,
    },
    ...(options || {}),
  });
}

async function getCamoImage(url: string) {
  let accessToken = await readData('accessToken');
  return request<Record<string, any>>(`/camos/image${url}`, {
    method: 'GET',
    headers: {
      token: `${accessToken}`,
    },
  });
}

export default {
  getCamosList,
  createCamos,
  updateCamos,
  removeCamos,
  getCamoImage,
};
