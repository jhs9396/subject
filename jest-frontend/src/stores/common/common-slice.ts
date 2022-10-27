import { createSlice } from '@reduxjs/toolkit';
import { initialState, name } from 'stores/common/common-initial';
import { SetCommon } from 'stores/common/common-reducers';

export const commonStore = createSlice({
  name,
  initialState: { ...initialState },
  reducers: { ...SetCommon }
});

export default commonStore.reducer;
export const { setLoading, setTitle } = commonStore.actions;
