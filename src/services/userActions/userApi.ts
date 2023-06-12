/* eslint-disable */
import { readData } from '../../utils/storage';
import request from '../interceptor';
import { InvalidToken } from '../authActions/login';
import { GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_ERROR } from '../../constants/user.constants';
import { dispatch } from '../store';
function getCurrantUserData() {
  const loginUserData = readData('currentUser');
  if (!loginUserData) {
    return {
      status: 'NOT_FOUND',
      code: 404,
      data: {},
    };
  }
  return {
    status: 'success',
    code: 200,
    data: loginUserData,
  };
}

async function getUserTypes(options?: { [key: string]: any }) {
  let accessToken = await readData('accessToken');
  const response = await request('/api/User/get_usermaster', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token: `${accessToken}`,
    },
    ...(options || {}),
  });
  if (response.code === 401) InvalidToken();
  if (response.code === 200) {
    const userTypeData = response.data[0].usertypes?.map((data: string) => ({
      label: data,
      value: data.toLowerCase(),
    }));

    const userGrpData = response.data[1].usergroups?.map((data: string) => ({
      label: data,
      value: data.toLowerCase(),
    }));

    return {
      userTypeData,
      userGrpData,
    };
  }
  return response;
}

const fetchUserListRequest = () => ({ type: GET_USER_REQUEST });
const fetchUserListSuccess = (payload: any) => ({ type: GET_USER_SUCCESS, payload });
const fetchUserListFailure = (message: string) => ({ type: GET_USER_ERROR, message });

async function getUsers(body: { [key: string]: any }, options?: { [key: string]: any }) {
  dispatch(fetchUserListRequest());
  try {
    let accessToken = await readData('accessToken');
    const response = await request('/api/User/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `${accessToken}`,
      },
      data: body,
      ...(options || {}),
    });
    if (response) dispatch(fetchUserListSuccess(response.data));
    return response;
  } catch (e: any) {
    dispatch(fetchUserListFailure(e));
  }
}

async function createUser(body: { [key: string]: any }, options?: { [key: string]: any }) {
  let accessToken = await readData('accessToken');
  return await request<API.LoginResult>('/api/User/add_user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: `${accessToken}`,
    },
    data: body,
    ...(options || {}),
  });
}

async function updateUser(body: { [key: string]: any }, options?: { [key: string]: any }) {
  let accessToken = await readData('accessToken');
  return await request<API.LoginResult>(`/api/User/updated_user/${body.user_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      token: `${accessToken}`,
    },
    data: body,
    ...(options || {}),
  });
}

async function removeUser(data: number[], options?: { [key: string]: any }) {
  let accessToken = await readData('accessToken');
  return request<Record<string, any>>('/api/User/delete_user', {
    headers: {
      token: `${accessToken}`,
    },
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

export default {
  getCurrantUserData,
  getUserTypes,
  getUsers,
  createUser,
  updateUser,
  removeUser,
};
