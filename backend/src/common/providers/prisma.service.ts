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

    // Pastikan direktori database ada (Penting untuk Railway Volumes)
    if (dbUrl.startsWith('file:')) {
      const dbPath = dbUrl.replace('file:', '');
      // Bersihkan path dari query params jika ada
      const cleanPath = dbPath.split('?')[0]; 
      const dbDir = path.dirname(path.isAbsolute(cleanPath) ? cleanPath : path.join(process.cwd(), cleanPath));
      
      if (!fs.existsSync(dbDir)) {
        console.log(`[PrismaService] Membuat direktori database: ${dbDir}`);
        fs.mkdirSync(dbDir, { recursive: true });
      }
    }

    const adapter = new PrismaBetterSqlite3({ url: dbUrl });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
