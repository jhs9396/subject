import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reselectTitleState } from 'stores/common/common-reselect';
import { setTitle } from 'stores/common/common-slice';

export interface ICommon {
  FetchTitle: () => string;
  MutationTitle: (title: string) => void;
}

export const useCommon = (): ICommon => {
  const dispatch = useDispatch();
  const title = useSelector(reselectTitleState);

  const FetchTitle = useCallback(() => title, [title]);
  const MutationTitle = useCallback(
    (title: string) => {
      dispatch(setTitle({ title }));
    },
    [dispatch]
  );

  return { FetchTitle, MutationTitle };
};
