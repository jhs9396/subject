export interface IMain {
  loading: boolean;
  isNodeClick: boolean;
  nodeInfo: JavascriptObject;
  graph: GraphType;
}

export interface IGraphResponse {
  payload: {
    data: {
      graph: GraphType;
    };
  };
}

export type GraphType = {
  nodes: JSONObject[];
  edges: JSONObject[];
};
