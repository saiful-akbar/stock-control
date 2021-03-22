import { combineReducers } from 'redux';
import { globalReducer } from './globalReducer';
import { authReducer } from './authReducer';
import { itemGroupsReducer } from './itemGroupsReducer';
import { documentsReducer } from './documentsReducer';
import { menusReducer } from './menusReducer';

const reducer = combineReducers({
  globalReducer,
  authReducer,
  itemGroupsReducer,
  documentsReducer,
  menusReducer
});

export default reducer;
