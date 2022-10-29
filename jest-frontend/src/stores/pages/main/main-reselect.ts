import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'stores';
import { GraphType, NodeClusterType } from 'stores/pages/main/main-interface';

export const loading = (state: RootState) => state.mainStore.loading;
export const isNodeClick = (state: RootState) => state.mainStore.isNodeClick;
export const nodeInfo = (state: RootState) => state.mainStore.nodeInfo;
export const nodeClusterInfo = (state: RootState) => state.mainStore.nodeClusterInfo;
export const graph = (state: RootState) => state.mainStore.graph;

export const reselectLoadingState = createSelector(loading, (loadingState: boolean) => loadingState);
export const reselectIsNodeClick = createSelector(isNodeClick, (isNodeClickState: boolean) => isNodeClickState);
export const reselectNodeInfo = createSelector(nodeInfo, (nodeInfoState: JavascriptObject) => nodeInfoState);
export const reselectNodeClusterInfo = createSelector(
  nodeClusterInfo,
  (nodeClusterInfoState: NodeClusterType) => nodeClusterInfoState
);
export const reselectGraph = createSelector(graph, (graphState: GraphType) => graphState);
