import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/graphql/auth/auth.service';
import { AuthResolver } from 'src/graphql/auth/auth.resolver';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/graphql/auth/jwt.strategy';
import { BasicMiddleware } from 'src/helper/middleware/basic.middleware';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.JWT_TOKEN_KEY,
      signOptions: {
        expiresIn:
          process.env.JWT_TOKEN_EXPIRESIN !== undefined
            ? String(process.env.JWT_TOKEN_EXPIRESIN)
            : 3600, // PROD: 1 hour, DEV: 1 day
      },
    }),
  ],
  providers: [AuthResolver, AuthService, JwtService, JwtStrategy],
})
export class AuthModule {}
