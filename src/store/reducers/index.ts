import { AnyAction, Reducer, combineReducers } from 'redux';
import { RootState } from '@store/index';
import { authReducer } from './auth.reducer';
import { themeReducer } from './theme.reducer';
import { socketReducer } from './socketReducer';
import { adminReducer } from './adminReducer';
import { userReducer } from './userReducer';
import { masterReducer } from './masterReducer';
import { blockedScriptsReducer } from './blockScriptReducer';
import { brokerReducer } from './brokerReducer';
import { ledgerReducer } from './ledgerReducer';
import { positionReducer } from './positionReducer';
import { cashBookReducer } from './cashBookReducer';
import { announcementReducer } from './announcementReducer';
import { mcxSymbolsReducer } from './mcxSymbolsReducer';
import { marketReducer } from './marketReducer';
import { holdingReducer } from './holdingReducer';
import { dashboardReducer } from './dashboard.reducer';

export const reducer: Reducer<RootState, AnyAction> = (state, action) => {
  return rootReducer(state, action);
};

export const rootReducer = combineReducers({
  auth: authReducer,
  socket: socketReducer,
  theme: themeReducer,
  admin: adminReducer,
  user: userReducer,
  master: masterReducer,
  blockedScripts: blockedScriptsReducer,
  broker: brokerReducer,
  ledger: ledgerReducer,
  position: positionReducer,
  holding: holdingReducer,
  market: marketReducer,
  cashBook: cashBookReducer,
  announcement: announcementReducer,
  mcxSymbols: mcxSymbolsReducer,
  dashboard: dashboardReducer,

  // position: positionReducer,
  // market: marketReducer,
  // instrument: instrumentReducer,
  // rejectedLog: rejectedLogReducer,
});

export default rootReducer;
