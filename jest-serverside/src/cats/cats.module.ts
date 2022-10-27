import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CatsResolver } from './cats.resolver';

@Module({
  controllers: [CatsController],
  providers: [CatsService, CatsResolver],
})
export class CatsModule {}
