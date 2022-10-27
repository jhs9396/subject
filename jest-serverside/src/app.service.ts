import { Injectable } from '@nestjs/common';
import {Request} from 'express';

@Injectable()
export class AppService {
  getHello(req: Request): string {
    console.log('req >> ', Object.keys(req.cookies));
    return 'Hello World!';
  }
}
