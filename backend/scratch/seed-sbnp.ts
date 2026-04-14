import { PrismaClient, StationType, IssueStatus } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import 'dotenv/config';

async function main() {
  const dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
  const adapter = new PrismaBetterSqlite3({ url: dbUrl });
  const prisma = new PrismaClient({ adapter });

  console.log('🌱 Seeding database...');

  // 1. Clear existing data
  await prisma.report.deleteMany();
  await prisma.station.deleteMany();

  // 2. Create Stations
  const s1 = await prisma.station.create({
    data: {
      id: '5904',
      name: 'Mensu Tg. Waka',
      type: StationType.MENARA_SUAR,
      latitude: -2.469,
      longitude: 126.045,
      powerSource: 'EG/EB',
      yearBuilt: 1998,
    },
  });

  const s2 = await prisma.station.create({
    data: {
      id: '5905',
      name: 'Rambu Suar Bobong',
      type: StationType.RAMBU_SUAR,
      latitude: -1.9,
      longitude: 124.4,
      powerSource: 'Solar Cell',
    },
  });

  // 3. Create Reports
  await prisma.report.create({
    data: {
      stationId: s1.id,
      reportedAt: new Date('2026-01-10T00:00:00Z'),
      issueStatus: IssueStatus.NIHIL,
      conditionPercent: 90,
      note: 'Kondisi baik',
    },
  });

  await prisma.report.create({
    data: {
      stationId: s1.id,
      reportedAt: new Date('2026-01-03T00:00:00Z'),
      issueStatus: IssueStatus.PADAM,
      conditionPercent: 40,
      issueCause: 'Lampu mati',
    },
  });

  await prisma.report.create({
    data: {
      stationId: s2.id,
      reportedAt: new Date('2026-01-12T00:00:00Z'),
      issueStatus: IssueStatus.RUSAK_RINGAN,
      conditionPercent: 75,
    },
  });

  console.log('✅ Seeding completed.');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
