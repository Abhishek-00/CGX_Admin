import {
  CREATE_CAMO_REQUEST,
  CREATE_CAMO_SUCCESS,
  CREATE_CAMO_ERROR,
  UPDATE_CAMO_REQUEST,
  UPDATE_CAMO_SUCCESS,
  UPDATE_CAMO_ERROR,
  GET_CAMO_REQUEST,
  GET_CAMO_SUCCESS,
  GET_CAMO_ERROR,
} from '../../constants/camo.constants';
const initialState = {
  fetching: false,
  camotags: [],
  camos: [],
  token: '',
  error: {},
};

export const Camo = (state = initialState, action: any) => {
  switch (action.type) {
    case CREATE_CAMO_REQUEST:
      return { ...state, fetching: true };
    case CREATE_CAMO_SUCCESS:
      return { ...state, camo: action.payload, fetching: false };
    case CREATE_CAMO_ERROR:
      return { ...state, fetching: false, error: action.payload };

    case UPDATE_CAMO_REQUEST:
      return { ...state, fetching: true };
    case UPDATE_CAMO_SUCCESS:
      return { ...state, camo: action.payload, fetching: false };
    case UPDATE_CAMO_ERROR:
      return { ...state, fetching: false, error: action.payload };

    case GET_CAMO_REQUEST:
      return { ...state, fetching: true };
    case GET_CAMO_SUCCESS:
      return {
        ...state,
        camos: action.payload.camos,
        camotags: action.payload.camotags,
        fetching: false,
      };
    case GET_CAMO_ERROR:
      return { ...state, fetching: false, error: action.payload };

    default:
      return state;
  }
};
