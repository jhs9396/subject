import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService, private readonly jwt: JwtService) {}

  @Mutation()
  async generateToken(@Args('id') id: string) {
    return this.authService.generateToken(id);
  }
}
