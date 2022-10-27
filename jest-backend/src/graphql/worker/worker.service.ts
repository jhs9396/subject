import { Injectable } from '@nestjs/common';
import { WorkerInput, WorkerOutput } from '../../graphql.schema.generated';
import { payload } from '../../helper/dummy/dummy';

@Injectable()
export class WorkerService {
  async findAll(): Promise<WorkerOutput[]> {
    return payload.workers;
  }

  async findOne(name: string): Promise<WorkerOutput> {
    return payload.workers.find((worker) => worker.name === name);
  }

  async create(workerInput: WorkerInput): Promise<WorkerOutput> {
    payload.workers.push(workerInput);
    return { ...workerInput };
  }

  async update(name: string, workerInput: WorkerInput): Promise<WorkerOutput> {
    const index = payload.workers.findIndex((worker) => worker.name === name);
    payload.workers[index] = {
      ...payload.workers[index],
      ...workerInput,
    };
    return payload.workers[index];
  }

  async delete(name: string): Promise<WorkerOutput> {
    const index = payload.workers.findIndex((worker) => worker.name === name);
    if (index < 0) return;
    const originWorker = payload.workers[index];
    payload.workers.splice(index, 1);

    return originWorker;
  }

  async findManyByOrganization(organization: string): Promise<WorkerOutput[]> {
    return payload.workers.filter((worker) => worker.organization === organization);
  }
}
