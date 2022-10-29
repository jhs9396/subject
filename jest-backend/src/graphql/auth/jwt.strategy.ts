import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/graphql/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly authService: AuthService, private readonly jwt: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_TOKEN_KEY,
    });
  }

  async validate(payload: any) {
    const currentTimeStamp = new Date().getTime();
    const payloadTimeStamp = Number(`${payload.exp}000`);
    if (currentTimeStamp > payloadTimeStamp) {
      const memoryTokenInfo = await this.authService.getMemoryTokenInfo();
      const decodeInfo = this.jwt.decode(memoryTokenInfo.refreshToken);
      const refreshExp = decodeInfo['exp'];

      if (currentTimeStamp > refreshExp) {
        await this.authService.setMemoryTokenInfo(this.authService.generateToken(decodeInfo['id']));
      } else {
        await this.authService.generateAccessToken(decodeInfo['id']);
      }
    }

    return true;
  }
}
