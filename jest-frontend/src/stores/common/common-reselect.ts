import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'stores';

export const loading = (state: RootState) => state.commonStore.loading;
export const title = (state: RootState) => state.commonStore.title;

export const reselectLoadingState = createSelector(loading, (loadingState: boolean) => loadingState);
export const reselectTitleState = createSelector(title, (title: string) => title);
