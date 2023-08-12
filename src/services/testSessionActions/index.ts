/* eslint-disable */
import request from '../interceptor';
import { readData } from '../../utils/storage';
import {
  GET_TEST_REQUEST,
  GET_TEST_SUCCESS,
  GET_TEST_ERROR,
} from '../../constants/testsession.constants';
import { dispatch } from '../store';

const fetchTestListRequest = () => ({ type: GET_TEST_REQUEST });
const fetchTestListSuccess = (payload: any) => ({ type: GET_TEST_SUCCESS, payload });
const fetchTestListFailure = (message: string) => ({ type: GET_TEST_ERROR, message });

async function getTestSessionList(body: { [key: string]: any }, options?: { [key: string]: any }) {
  try {
    dispatch(fetchTestListRequest());
    let accessToken = await readData('accessToken');
    const response = await request<API.LoginResult>('/testsession', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `${accessToken}`,
      },
      data: body,
      ...(options || {}),
    });
    if (response) dispatch(fetchTestListSuccess(response.data[0].camos));
    return response;
  } catch (e: any) {
    dispatch(fetchTestListFailure(e));
    return e;
  }
}
async function createTestSession(body: { [key: string]: any }, options?: { [key: string]: any }) {
  let accessToken = await readData('accessToken');
  return request<API.LoginResult>('/testsession/createtest', {
    method: 'POST',
    headers: {
      token: `${accessToken}`,
    },
    data: body,
    ...(options || {}),
  });
}

async function updateTestSession(
  id: number,
  body: { [key: string]: any },
  options?: { [key: string]: any },
) {
  let accessToken = await readData('accessToken');
  return request<API.LoginResult>(`/testsession/updattestsession/${id}`, {
    method: 'PUT',
    headers: {
      token: `${accessToken}`,
    },
    data: body,
    ...(options || {}),
  });
}

async function removeTestSession(data: { key: number[] }, options?: { [key: string]: any }) {
  let accessToken = await readData('accessToken');
  return request<Record<string, any>>('/testsession/delete_test', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      token: `${accessToken}`,
    },
    data,
    ...(options || {}),
  });
}

export default {
  getTestSessionList,
  createTestSession,
  updateTestSession,
  removeTestSession,
};
