import {
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_ERROR,
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_ERROR,
} from '../../constants/user.constants';
const initialState = {
  fetching: false,
  user: {},
  users: [],
  token: '',
  error: {},
};

export const User = (state = initialState, action: any) => {
  switch (action.type) {
    case CREATE_USER_REQUEST:
      return { ...state, fetching: true };
    case CREATE_USER_SUCCESS:
      return { ...state, user: action.payload, fetching: false };
    case CREATE_USER_ERROR:
      return { ...state, fetching: false, error: action.payload };

    case LOGIN_USER_REQUEST:
      return { ...state, fetching: true };
    case LOGIN_USER_SUCCESS:
      return { ...state, user: action.payload, token: action.payload.token, fetching: false };
    case LOGIN_USER_ERROR:
      return { ...state, fetching: false, error: action.payload };

    case UPDATE_USER_REQUEST:
      return { ...state, fetching: true };
    case UPDATE_USER_SUCCESS:
      return { ...state, user: action.payload, fetching: false };
    case UPDATE_USER_ERROR:
      return { ...state, fetching: false, error: action.payload };

    case GET_USER_REQUEST:
      return { ...state, fetching: true };
    case GET_USER_SUCCESS:
      return { ...state, users: action.payload, fetching: false };
    case GET_USER_ERROR:
      return { ...state, fetching: false, error: action.payload };

    default:
      return state;
  }
};
