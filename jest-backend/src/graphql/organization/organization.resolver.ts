import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { OrganizationService } from './organization.service';
import { OrganizationInput, OrganizationOutput, WorkerOutput } from 'src/graphql.schema.generated';
import { WorkerService } from '../worker/worker.service';

@Resolver((of) => OrganizationOutput)
export class OrganizationResolver {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly workerService: WorkerService,
  ) {}

  @Query()
  async organizations(): Promise<OrganizationOutput[]> {
    return await this.organizationService.findAll();
  }

  @Query()
  async organization(@Args('name') name: string): Promise<OrganizationOutput> {
    return await this.organizationService.findOne(name);
  }

  @Mutation()
  async createOrganization(
    @Args('organizationInput') organizationInput: OrganizationInput,
  ): Promise<OrganizationOutput> {
    return await this.organizationService.create(organizationInput);
  }

  @Mutation()
  async updateOrganization(
    @Args('name') name: string,
    @Args('organizationInput') organizationInput: OrganizationInput,
  ): Promise<OrganizationOutput> {
    return await this.organizationService.update(name, organizationInput);
  }

  @Mutation()
  async deleteOrganization(@Args('name') name: string): Promise<OrganizationOutput> {
    return await this.organizationService.delete(name);
  }

  @ResolveField()
  async workers(@Parent() organization: OrganizationOutput): Promise<WorkerOutput[]> {
    return await this.workerService.findManyByOrganization(organization.name);
  }
}
