import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class KeepAliveService {
  private readonly logger = new Logger(KeepAliveService.name);
  
  // Ambil dari APP_URL manual, atau otomatis dari domain Railway
  private getAppUrl(): string | undefined {
    if (process.env.APP_URL) return process.env.APP_URL;
    if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
    return undefined;
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleKeepAlive() {
    const url = this.getAppUrl();
    if (!url) {
      this.logger.debug('APP_URL atau RAILWAY_PUBLIC_DOMAIN tidak ditemukan, skip ping.');
      return;
    }

    try {
      this.logger.log(`Memulai self-ping ke: ${url}/api/health`);
      await axios.get(`${url}/api/health`);
      this.logger.log('Keep-alive ping successful.');
    } catch (error) {
      this.logger.error(
        `Keep-alive ping failed: ${error.message}`,
        error.stack,
      );
    }
  }
}
