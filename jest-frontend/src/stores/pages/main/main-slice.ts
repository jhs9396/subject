import { createSlice } from '@reduxjs/toolkit';
import { initialState, name } from 'stores/pages/main/main-initial';
import { SetMain } from 'stores/pages/main/main-reducers';
import { ThunkGraph } from 'stores/pages/main/main-extra-reducers';

export const mainStore = createSlice({
  name,
  initialState: { ...initialState },
  reducers: { ...SetMain },
  extraReducers: { ...ThunkGraph }
});

export default mainStore.reducer;
export const { setLoading, setIsNodeClick, setNodeInfo } = mainStore.actions;
