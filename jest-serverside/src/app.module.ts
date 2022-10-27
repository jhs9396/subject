import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { OwnerModule } from './owner/owner.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    CatsModule,
    OwnerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
