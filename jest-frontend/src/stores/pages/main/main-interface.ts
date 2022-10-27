export interface IMain {
  loading: boolean;
  isNodeClick: boolean;
  nodeInfo: JavascriptObject;
  graph: GraphType;
}

export interface IGraphNode {
  id: number;
  label: string;
  name: string;
  radius: number | null;
  color: string | null;
}

export interface IGraphEdge {
  label: string;
  source: string | JSONObject;
  target: string | JSONObject;
}

export interface IGraphResponse {
  payload: {
    data: {
      graph: GraphType;
    };
  };
}

export interface IExpandGraphResponse {
  payload: {
    data: {
      graphExpand: GraphType;
    };
  };
}

export type GraphType = {
  nodes: IGraphNode[];
  edges: IGraphEdge[];
};
