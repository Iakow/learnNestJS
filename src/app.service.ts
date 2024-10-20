import { Injectable } from '@nestjs/common';
import { appDescription } from './constants/app-description';

@Injectable()
export class AppService {
  getHello(): string {
    return appDescription;
  }
}
