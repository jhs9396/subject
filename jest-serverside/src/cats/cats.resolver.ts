import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CatsService } from './cats.service';
import { Cat } from './entities/cat.entity';
import { CreateCatInput } from './dto/create-cat.input';

@Resolver(() => Cat)
export class CatsResolver {
  constructor(private readonly catsService: CatsService) {}

  @Mutation(() => Cat, { name: 'createCat' })
  async create(@Args('CreateCatInput') createCatInput: CreateCatInput) {
    return this.catsService.create(createCatInput);
  }

  @Query((returns) => [Cat], { name: 'cats' })
  findAll(): Cat[] {
    return this.catsService.findAll();
  }
}
