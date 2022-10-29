import { IMain } from 'stores/pages/main/main-interface';

export const name = 'main';
export const initialState: IMain = {
  loading: false,
  isNodeClick: false,
  nodeInfo: {},
  nodeClusterInfo: {},
  graph: { nodes: [], edges: [] }
};
