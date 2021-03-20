import { combineReducers } from 'redux';
import { globalReducer } from './globalReducer';
import { authReducer } from './authReducer';
import { itemGroupsReducer } from './itemGroupsReducer';
import { documentsReducer } from './documentsReducer';

const reducer = combineReducers({
  globalReducer,
  authReducer,
  itemGroupsReducer,
  documentsReducer
});

export default reducer;
