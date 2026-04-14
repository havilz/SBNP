import { PrismaClient, StationType, IssueStatus } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing database...');
  await prisma.report.deleteMany();
  await prisma.station.deleteMany();

  console.log('Seeding stations...');

  const stations = [
    {
      id: '5904',
      name: 'Mensu Tg. Waka',
      type: StationType.MENARA_SUAR,
      latitude: -2.469,
      longitude: 126.045,
      powerSource: 'EG/EB',
      yearBuilt: 1998,
    },
    {
      id: '5905',
      name: 'Rasu Tg. Sopi',
      type: StationType.RAMBU_SUAR,
      latitude: 2.456,
      longitude: 128.567,
      powerSource: 'Solar Panel',
      yearBuilt: 2005,
    },
    {
      id: '5906',
      name: 'Mensu Manado',
      type: StationType.MENARA_SUAR,
      latitude: 1.493,
      longitude: 124.841,
      powerSource: 'PLN/Genset',
      yearBuilt: 1985,
    },
    {
      id: '5907',
      name: 'Rasu Bitung',
      type: StationType.RAMBU_SUAR,
      latitude: 1.442,
      longitude: 125.191,
      powerSource: 'Battery',
      yearBuilt: 2012,
    },
  ];

  for (const s of stations) {
    const station = await prisma.station.create({ data: s });
    console.log(`Created station: ${station.name}`);

    // Create 3 months of history for each station
    const now = new Date();
    for (let i = 0; i < 3; i++) {
        const reportedAt = new Date(now.getFullYear(), now.getMonth() - i, 10);
        
        // Randomize status for variety
        let status: IssueStatus = IssueStatus.NIHIL;
        let percent = 100;
        
        if (i === 1 && s.id === '5905') {
            status = IssueStatus.PADAM;
            percent = 40;
        } else if (i === 2 && s.id === '5906') {
            status = IssueStatus.RUSAK_RINGAN;
            percent = 80;
        }

        await prisma.report.create({
            data: {
                stationId: station.id,
                reportedAt,
                issueStatus: status,
                conditionPercent: percent,
                note: i === 0 ? 'Laporan rutin bulanan' : 'Data histori',
            }
        });
    }
    console.log(`  - 3 reports created for ${station.name}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
