import { Injectable } from '@nestjs/common';
import { Cat } from './entities/cat.entity';
import { CreateCatInput } from './dto/create-cat.input';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  async create(createCatInput: CreateCatInput) {
    this.cats.push(createCatInput);
    return createCatInput;
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
