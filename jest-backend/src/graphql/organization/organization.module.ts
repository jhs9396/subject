import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationResolver } from './organization.resolver';
import { WorkerModule } from '../worker/worker.module';

@Module({
  imports: [WorkerModule],
  providers: [OrganizationResolver, OrganizationService],
})
export class OrganizationModule {}
