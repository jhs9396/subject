export interface IGraphEvent {
  nodeClick?: (isClick: boolean, nodeInfo: JavascriptObject) => void;
  nodeExpend?: (selectedNode: JavascriptObject) => void;
  searchNode?: () => string;
}

export type GraphOptionsType = {
  width?: string;
  height?: string;
  node?: {
    radius?: number;
    lookAt?: string;
  };
  edge?: {
    color?: string;
    strokeWidth?: number;
    id?: string;
  };
};
