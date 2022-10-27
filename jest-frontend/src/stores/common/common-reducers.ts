import { PayloadAction } from '@reduxjs/toolkit';
import { ICommonState } from 'stores/common/common-interface';

export const SetCommon = {
  setLoading: (state: ICommonState, action: PayloadAction<{ loading: boolean }>): void => {
    state.loading = action.payload.loading;
  },
  setTitle: (state: ICommonState, action: PayloadAction<{ title: string }>): void => {
    state.title = action.payload.title;
  }
};
