import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return (
      'This application allows you to get an estimate of the value of your ' +
      'car based on the available reports in the database.'
    );
  }
}
