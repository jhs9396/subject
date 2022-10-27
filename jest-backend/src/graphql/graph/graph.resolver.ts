import { Query, Resolver } from '@nestjs/graphql';
import { GraphService } from 'src/graphql/graph/graph.service';

@Resolver('GraphOutput')
export class GraphResolver {
  constructor(private readonly graphService: GraphService) {}

  @Query()
  async graph() {
    return this.graphService.initGraphData();
  }
}
