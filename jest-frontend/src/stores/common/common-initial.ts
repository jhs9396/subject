import { ICommonState } from 'stores/common/common-interface';

export const name = 'common';
export const initialState: ICommonState = {
  loading: false,
  title: '리엑트'
};
