import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
    const adapter = new PrismaBetterSqlite3({ url: dbUrl });

    super({ adapter });

    this.logger.log(`Menyambung ke Database: ${dbUrl}`);

    // Pastikan direktori database ada (Penting untuk Railway Volumes)
    if (dbUrl.startsWith('file:')) {
      const dbPath = dbUrl.replace('file:', '');
      const cleanPath = dbPath.split('?')[0]; 
      const dbDir = path.dirname(path.isAbsolute(cleanPath) ? cleanPath : path.join(process.cwd(), cleanPath));
      
      if (!fs.existsSync(dbDir)) {
        this.logger.log(`Membuat direktori database baru di: ${dbDir}`);
        fs.mkdirSync(dbDir, { recursive: true });
      } else {
        this.logger.log(`Direktori database ditemukan: ${dbDir}`);
      }
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
