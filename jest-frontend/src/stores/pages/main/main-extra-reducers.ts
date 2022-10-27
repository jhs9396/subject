import { PayloadAction } from '@reduxjs/toolkit';
import { asyncThunkGraphData } from 'stores/pages/main/main-async-thunk';
import { IGraphResponse, IMain } from 'stores/pages/main/main-interface';

export const ThunkGraph = {
  [asyncThunkGraphData.pending.type]: (state: IMain): void => {
    state.loading = true;
  },
  [asyncThunkGraphData.fulfilled.type]: (state: IMain, action: IGraphResponse): void => {
    try {
      console.log('act ion', action);
      state.graph = action.payload.data.graph;

      // Status
      state.loading = false;
    } catch (error) {
      console.log('asyncThunkGraphData(fulfilled) Error : ', error);
    }
  },
  [asyncThunkGraphData.rejected.type]: (
    state: IMain,
    action: PayloadAction<{ message: string; code: number }>
  ): void => {
    state.loading = false;
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    window.location.href = '/#/';
  }
};
