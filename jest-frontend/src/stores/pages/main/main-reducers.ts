import { PayloadAction } from '@reduxjs/toolkit';
import { IMain } from 'stores/pages/main/main-interface';

export const SetMain = {
  setLoading: (state: IMain, action: PayloadAction<{ loading: boolean }>): void => {
    state.loading = action.payload.loading;
  },
  setIsNodeClick: (state: IMain, action: PayloadAction<{ isNodeClick: boolean }>): void => {
    state.isNodeClick = action.payload.isNodeClick;
  },
  setNodeInfo: (state: IMain, action: PayloadAction<{ nodeInfo: JavascriptObject }>): void => {
    state.nodeInfo = action.payload.nodeInfo;
  }
};
