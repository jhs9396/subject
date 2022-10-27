import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import commonStore from 'stores/common/common-slice';
import mainStore from 'stores/pages/main/main-slice';

export const store = configureStore({
  reducer: {
    commonStore,
    mainStore
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
