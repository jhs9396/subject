import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  reselectGraph,
  reselectIsNodeClick,
  reselectNodeClusterInfo,
  reselectNodeInfo
} from 'stores/pages/main/main-reselect';
import { initNodeClusterInfo, setIsNodeClick, setNodeClusterInfo, setNodeInfo } from 'stores/pages/main/main-slice';
import { GraphType, NodeClusterType } from 'stores/pages/main/main-interface';
import { asyncThunkGraphData, asyncThunkGraphExpandData } from 'stores/pages/main/main-async-thunk';
import { queryMainGraph, queryMainGraphExpand } from 'hooks/pages/main/main-query';
import { sendPythonApi } from 'helper/api';

export interface IMain {
  FetchIsNodeClick: () => boolean;
  MutationIsNodeClick: (isNodeClick: boolean) => void;

  FetchNodeInfo: () => JavascriptObject;
  MutationNodeInfo: (nodeInfo: JavascriptObject) => void;

  FetchGraph: () => GraphType;
  SearchGraph: () => void;

  SearchExpandGraph: (nodeInfo: JavascriptObject) => void;

  SearchNodeClustering: (edges: JavascriptObject[]) => void;
  FetchNodeClusterInfo: () => NodeClusterType;
  MutationNodeClusterInfo: (type: string) => void;
}

export const useMain = (): IMain => {
  const dispatch = useDispatch<any>();
  const isNodeClick = useSelector(reselectIsNodeClick);
  const nodeInfo = useSelector(reselectNodeInfo) as JavascriptObject;
  const nodeClusterInfo = useSelector(reselectNodeClusterInfo) as NodeClusterType;
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

  const SearchNodeClustering = useCallback(
    async (edges: JavascriptObject[]) => {
      if (isNodeClick) {
        const res = await sendPythonApi(
          '/analysis/clustering',
          'POST',
          { 'Access-Control-Allow-Origin': '*' },
          {
            edges
          }
        );

        for (const clusterKey of Object.keys(res.data)) {
          const findMembers = res.data[clusterKey].find((nodeName: string) => nodeName === nodeInfo.properties.name);
          if (findMembers) {
            dispatch(setNodeClusterInfo({ nodeClusterInfo: { clusterKey, members: res.data[clusterKey] } }));
          }
        }
      }
    },
    [dispatch, isNodeClick, nodeInfo]
  );
  const FetchNodeClusterInfo = useCallback(() => nodeClusterInfo, [nodeClusterInfo]);
  const MutationNodeClusterInfo = useCallback(
    (type: string) => {
      switch (type) {
        case 'init': {
          dispatch(initNodeClusterInfo());
          break;
        }
        default: {
          break;
        }
      }
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

    SearchExpandGraph,

    SearchNodeClustering,
    FetchNodeClusterInfo,
    MutationNodeClusterInfo
  };
};
