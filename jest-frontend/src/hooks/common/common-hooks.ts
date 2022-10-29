import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { get } from 'lodash';
import { sendApi, sendPythonApi } from 'helper/api';
import { queryGenerateToken } from 'hooks/common/common-query';
import { reselectTitleState } from 'stores/common/common-reselect';
import { setTitle } from 'stores/common/common-slice';
import { IToken } from 'types/common';

export interface ICommon {
  FetchTitle: () => string;
  MutationTitle: (title: string) => void;

  QueryToken: (id: string) => UseQueryResult;
  FetchToken: () => IToken;

  QueryIsRunningPythonServer: () => UseQueryResult;
}

export const useCommon = (): ICommon => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const title = useSelector(reselectTitleState);

  const FetchTitle = useCallback(() => title, [title]);
  const MutationTitle = useCallback(
    (title: string) => {
      dispatch(setTitle({ title }));
    },
    [dispatch]
  );

  const QueryToken = (id: string) => {
    return useQuery(['accessToken'], async () => {
      const res = await sendApi(queryGenerateToken(id));
      const token = get(res, 'data.data.generateToken', {});

      sessionStorage.setItem('accessToken', token.accessToken);
      sessionStorage.setItem('exp', token.exp);

      return token;
    });
  };

  const FetchToken = () => queryClient.getQueryData(['accessToken']) as IToken;

  const QueryIsRunningPythonServer = () => {
    return useQuery(['isRunningPythonServer'], async () => {
      try {
        const res = await sendPythonApi('/', 'GET', {}, {});
        return res?.data ? res.data.status : null;
      } catch (error) {
        return null;
      }
    });
  };

  return { FetchTitle, MutationTitle, QueryToken, FetchToken, QueryIsRunningPythonServer };
};
