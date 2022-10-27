import { Injectable } from '@nestjs/common';
import { OrganizationInput, OrganizationOutput } from '../../graphql.schema.generated';
import { payload } from '../../helper/dummy/dummy';

@Injectable()
export class OrganizationService {
  async findAll(): Promise<OrganizationOutput[]> {
    return payload.organizations;
  }

  async findOne(name: string): Promise<OrganizationOutput> {
    return payload.organizations.find((organization) => organization.name === name);
  }

  async create(organizationInput: OrganizationInput): Promise<OrganizationOutput> {
    payload.organizations.push(organizationInput);
    return { ...organizationInput };
  }

  async update(name: string, organizationInput: OrganizationInput): Promise<OrganizationOutput> {
    const index = payload.organizations.findIndex((organization) => organization.name === name);
    payload.organizations[index] = {
      ...payload.organizations[index],
      ...organizationInput,
    };
    return payload.organizations[index];
  }

  async delete(name: string): Promise<OrganizationOutput> {
    const index = payload.organizations.findIndex((organization) => organization.name === name);
    if (index < 0) return;

    const copyOrganization: OrganizationOutput = payload.organizations[index];
    payload.organizations.splice(index, 1);

    return copyOrganization;
  }
}
