import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlOptions } from '../graphql.options';
import { OrganizationModule } from './graphql/organization/organization.module';
import { WorkerModule } from './graphql/worker/worker.module';
import { GraphModule } from './graphql/graph/graph.module';
import { AuthModule } from './graphql/auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useClass: GraphqlOptions,
    }),
    OrganizationModule,
    WorkerModule,
    GraphModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
