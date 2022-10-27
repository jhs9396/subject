import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private tokenInfo;
  constructor(private readonly jwt: JwtService) {
    this.tokenInfo = {};
  }

  async generateToken(id: string) {
    const accessToken = await this.jwt.signAsync(
      {
        type: 'web',
        id,
      },
      {
        secret: process.env.JWT_TOKEN_KEY,
        expiresIn:
          process.env.JWT_TOKEN_EXPIRESIN !== undefined
            ? String(process.env.JWT_TOKEN_EXPIRESIN)
            : 3600,
      },
    );
    const refreshToken = await this.jwt.signAsync(
      {
        type: 'web',
        id,
      },
      {
        secret: process.env.JWT_REFRESH_TOKEN_KEY,
        expiresIn:
          process.env.JWT_REFRESH_TOKEN_EXPIRESIN !== undefined
            ? String(process.env.JWT_REFRESH_TOKEN_EXPIRESIN)
            : 86400,
      },
    );
    const exp = this.jwt.decode(accessToken)['exp'];
    this.tokenInfo = { accessToken, refreshToken, exp };

    return this.tokenInfo;
  }
}
