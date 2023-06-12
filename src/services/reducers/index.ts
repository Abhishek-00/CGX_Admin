import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const config = {
  key: 'primary',
  storage,
};

import { User } from './User';
import { Camo } from './Camo';
import { Background } from './Background';
import { TestSession } from './TestSession';

const state = {
  User,
  Camo,
  Background,
  TestSession,
};

export default persistCombineReducers(config, state);
