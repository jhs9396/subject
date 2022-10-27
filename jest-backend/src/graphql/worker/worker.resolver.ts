import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WorkerService } from './worker.service';
import { WorkerInput, WorkerOutput } from '../../graphql.schema.generated';

@Resolver()
export class WorkerResolver {
  constructor(private readonly workerService: WorkerService) {}

  @Query()
  async workers(): Promise<WorkerOutput[]> {
    return await this.workerService.findAll();
  }

  @Query()
  async worker(@Args('name') name: string): Promise<WorkerOutput> {
    return await this.workerService.findOne(name);
  }

  @Mutation()
  async createWorker(@Args('workerInput') workerInput: WorkerInput): Promise<WorkerOutput> {
    return await this.workerService.create(workerInput);
  }

  @Mutation()
  async updateWorker(
    @Args('name') name: string,
    @Args('workerInput') workerInput: WorkerInput,
  ): Promise<WorkerOutput> {
    return await this.workerService.update(name, workerInput);
  }

  @Mutation()
  async deleteWorker(@Args('name') name: string): Promise<WorkerOutput> {
    return await this.workerService.delete(name);
  }
}
