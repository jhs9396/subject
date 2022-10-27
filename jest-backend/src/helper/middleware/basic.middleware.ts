import { Injectable, NestMiddleware } from '@nestjs/common';
import { contains } from 'class-validator';
import { NextFunction } from 'express';
import { isEmpty } from 'lodash';
import { AuthService } from 'src/graphql/auth/auth.service';

@Injectable()
export class BasicMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  /* context /graphql */
  use(req: Request, res: Response, next: NextFunction): any {
    const origin = req.headers['origin'];
    if (contains(origin, '4000') || isEmpty(origin)) {
      // gql playground 무시
      next();
    }
  }
}
