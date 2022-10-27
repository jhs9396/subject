import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reselectGraph, reselectIsNodeClick, reselectNodeInfo } from 'stores/pages/main/main-reselect';
import { setIsNodeClick, setNodeInfo } from 'stores/pages/main/main-slice';
import { GraphType } from 'stores/pages/main/main-interface';
import { asyncThunkGraphData, asyncThunkGraphExpandData } from 'stores/pages/main/main-async-thunk';
import { queryMainGraph, queryMainGraphExpand } from './main-query';

export interface IMain {
  FetchIsNodeClick: () => boolean;
  MutationIsNodeClick: (isNodeClick: boolean) => void;

  FetchNodeInfo: () => JavascriptObject;
  MutationNodeInfo: (nodeInfo: JavascriptObject) => void;

  FetchGraph: () => GraphType;
  SearchGraph: () => void;

  SearchExpandGraph: (nodeInfo: JavascriptObject) => void;
}

export const useMain = (): IMain => {
  const dispatch = useDispatch<any>();
  const isNodeClick = useSelector(reselectIsNodeClick);
  const nodeInfo = useSelector(reselectNodeInfo);
  const graph = useSelector(reselectGraph);

  const FetchIsNodeClick = useCallback(() => isNodeClick, [isNodeClick]);
  const MutationIsNodeClick = useCallback(
    (isNodeClick: boolean) => {
      dispatch(setIsNodeClick({ isNodeClick }));
    },
    [dispatch]
  );

  const FetchNodeInfo = useCallback(() => nodeInfo, [nodeInfo]);
  const MutationNodeInfo = useCallback((nodeInfo: JavascriptObject) => {
    dispatch(setNodeInfo({ nodeInfo }));
  }, []);

  const FetchGraph = useCallback(() => graph, [graph]);
  const SearchGraph = useCallback(async () => {
    const payload = queryMainGraph();
    dispatch(asyncThunkGraphData({ payload }));
  }, [dispatch]);

  const SearchExpandGraph = useCallback(
    nodeInfo => {
      const payload = queryMainGraphExpand(nodeInfo);
      dispatch(asyncThunkGraphExpandData({ payload }));
    },
    [dispatch]
  );

  return {
    FetchIsNodeClick,
    MutationIsNodeClick,

    FetchNodeInfo,
    MutationNodeInfo,

    FetchGraph,
    SearchGraph,

    SearchExpandGraph
  };
};
