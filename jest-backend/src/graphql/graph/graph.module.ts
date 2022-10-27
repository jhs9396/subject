import { Module } from '@nestjs/common';
import { GraphService } from './graph.service';
import { GraphResolver } from './graph.resolver';

@Module({
  providers: [GraphResolver, GraphService],
})
export class GraphModule {}
