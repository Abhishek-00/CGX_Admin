import {
  CREATE_BACKGROUND_REQUEST,
  CREATE_BACKGROUND_SUCCESS,
  CREATE_BACKGROUND_ERROR,
  UPDATE_BACKGROUND_REQUEST,
  UPDATE_BACKGROUND_SUCCESS,
  UPDATE_BACKGROUND_ERROR,
  GET_BACKGROUND_REQUEST,
  GET_BACKGROUND_SUCCESS,
  GET_BACKGROUND_ERROR,
} from '../../constants/background.constants';
const initialState = {
  fetching: false,
  backgrounds: [],
  token: '',
  error: {},
};

export const Background = (state = initialState, action: any) => {
  switch (action.type) {
    case CREATE_BACKGROUND_REQUEST:
      return { ...state, fetching: true };
    case CREATE_BACKGROUND_SUCCESS:
      return { ...state, backgrounds: action.payload, fetching: false };
    case CREATE_BACKGROUND_ERROR:
      return { ...state, fetching: false, error: action.payload };

    case UPDATE_BACKGROUND_REQUEST:
      return { ...state, fetching: true };
    case UPDATE_BACKGROUND_SUCCESS:
      return { ...state, backgrounds: action.payload, fetching: false };
    case UPDATE_BACKGROUND_ERROR:
      return { ...state, fetching: false, error: action.payload };

    case GET_BACKGROUND_REQUEST:
      return { ...state, fetching: true };
    case GET_BACKGROUND_SUCCESS:
      return { ...state, backgrounds: action.payload, fetching: false };
    case GET_BACKGROUND_ERROR:
      return { ...state, fetching: false, error: action.payload };

    default:
      return state;
  }
};
