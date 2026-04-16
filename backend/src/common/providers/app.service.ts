import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkHealth(): string {
    return 'SBNP Monitoring API is healthy and running.';
  }
}
