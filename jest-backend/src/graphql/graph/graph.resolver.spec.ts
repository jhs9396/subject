import { Test, TestingModule } from '@nestjs/testing';
import { GraphResolver } from './graph.resolver';
import { GraphService } from './graph.service';

describe('GraphResolver', () => {
  let resolver: GraphResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraphResolver, GraphService],
    }).compile();

    resolver = module.get<GraphResolver>(GraphResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
