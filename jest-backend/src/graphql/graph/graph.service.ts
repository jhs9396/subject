import { Injectable } from '@nestjs/common';
import { GraphEdge, GraphInput, GraphNode } from 'src/graphql.schema.generated';
import { expandedData, graphData } from 'src/helper/dummy/graph';

@Injectable()
export class GraphService {
  async initGraphData() {
    return graphData;
  }

  async searchExpandGraphData(selectedNode: GraphInput) {
    const edges = expandedData.edges.filter((edge: GraphEdge) => edge.source === selectedNode.id);
    const nodes = expandedData.nodes.filter((node: GraphNode) =>
      edges.map((edge: GraphEdge) => edge.target).includes(node.id),
    );
    return { nodes, edges };
  }
}
