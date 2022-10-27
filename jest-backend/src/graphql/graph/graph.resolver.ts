import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { GraphInput } from 'src/graphql.schema.generated';
import { GraphService } from 'src/graphql/graph/graph.service';
import { GqlAuthGuard } from 'src/helper/guards/graphql-auth.guard';

@Resolver('GraphOutput')
export class GraphResolver {
  constructor(private readonly graphService: GraphService) {}

  @UseGuards(GqlAuthGuard)
  @Query()
  async graph() {
    return this.graphService.initGraphData();
  }

  @UseGuards(GqlAuthGuard)
  @Query()
  async graphExpand(@Args('graphInput') graphInput: GraphInput) {
    return this.graphService.searchExpandGraphData(graphInput);
  }
}
