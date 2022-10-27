import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Cat {
  @Field(() => String)
  name: string;

  @Field(() => Int)
  age: number;

  @Field(() => String, { nullable: true })
  alias?: string;
}
