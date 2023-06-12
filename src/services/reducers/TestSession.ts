import {
  CREATE_TEST_REQUEST,
  CREATE_TEST_SUCCESS,
  CREATE_TEST_ERROR,
  UPDATE_TEST_REQUEST,
  UPDATE_TEST_SUCCESS,
  UPDATE_TEST_ERROR,
  GET_TEST_REQUEST,
  GET_TEST_SUCCESS,
  GET_TEST_ERROR,
} from '../../constants/testsession.constants';
const initialState = {
  fetching: false,
  testsessions: [],
  error: {},
};

export const TestSession = (state = initialState, action: any) => {
  switch (action.type) {
    case CREATE_TEST_REQUEST:
      return { ...state, fetching: true };
    case CREATE_TEST_SUCCESS:
      return { ...state, testsessions: action.payload, fetching: false };
    case CREATE_TEST_ERROR:
      return { ...state, fetching: false, error: action.payload };

    case UPDATE_TEST_REQUEST:
      return { ...state, fetching: true };
    case UPDATE_TEST_SUCCESS:
      return { ...state, testsessions: action.payload, fetching: false };
    case UPDATE_TEST_ERROR:
      return { ...state, fetching: false, error: action.payload };

    case GET_TEST_REQUEST:
      return { ...state, fetching: true };
    case GET_TEST_SUCCESS:
      return {
        ...state,
        testsessions: action.payload,
        fetching: false,
      };
    case GET_TEST_ERROR:
      return { ...state, fetching: false, error: action.payload };

    default:
      return state;
  }
};
