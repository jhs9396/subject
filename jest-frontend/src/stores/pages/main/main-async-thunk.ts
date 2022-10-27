import { createAsyncThunk } from '@reduxjs/toolkit';

import { first } from 'lodash';
import { name } from 'stores/pages/main/main-initial';
import { sendApi } from 'helper/api';
import { ISendGql } from 'helper/gql-type';

export const asyncThunkGraphData = createAsyncThunk(
  `${name}/query/graph`,
  async ({ payload }: { payload: ISendGql }, thunkAPI) => {
    const { data, errors = [] } = await sendApi(payload);
    if (errors.length === 0) {
      return data;
    }
    return thunkAPI.rejectWithValue(first(errors));
  }
);

export const asyncThunkGraphExpandData = createAsyncThunk(
  `${name}/query/graphExpand`,
  async ({ payload }: { payload: ISendGql }, thunkAPI) => {
    const { data, errors = [] } = await sendApi(payload);
    if (errors.length === 0) {
      return data;
    }
    return thunkAPI.rejectWithValue(first(errors));
  }
);
