import { Injectable } from '@nestjs/common';
import { graphData } from 'src/helper/dummy/graph';

@Injectable()
export class GraphService {
  async initGraphData() {
    return graphData;
  }
}
