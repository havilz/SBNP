import { PrismaClient, IssueStatus } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing database...');
  await prisma.report.deleteMany();
  await prisma.station.deleteMany();
  await prisma.category.deleteMany();

  console.log('Seeding categories...');
  const cat1 = await prisma.category.create({
    data: { name: 'MENARA SUAR', roman: 'I', displayOrder: 1 },
  });
  const cat2 = await prisma.category.create({
    data: { name: 'RAMBU SUAR', roman: 'II', displayOrder: 2 },
  });
  const cat3 = await prisma.category.create({
    data: { name: 'RAMBU SUAR TUNTUN', roman: 'III', displayOrder: 3 },
  });
  const cat4 = await prisma.category.create({
    data: { name: 'RAMBU SUAR LAMPU PELABUHAN', roman: 'IV', displayOrder: 4 },
  });
  const cat5 = await prisma.category.create({
    data: { name: 'PELAMPUNG SUAR', roman: 'V', displayOrder: 5 },
  });
  const cat6 = await prisma.category.create({
    data: { name: 'TANDA SIANG', roman: 'VI', displayOrder: 6 },
  });

  console.log('Seeding stations...');

  const stationsData = [
    // Category I
    {
      id: '5825',
      name: 'Mensu Pulau May (Kab.Malteng-Masohi)',
      categoryId: cat1.id,
      latitude: -5.39936,
      longitude: 127.79035,
      powerSource: 'EG/EB',
      yearBuilt: '2012',
    },
    {
      id: '5904',
      name: 'Mensu Tg. Waka(Kab. Kep Sula-Sanana)',
      categoryId: cat1.id,
      latitude: -2.47000,
      longitude: 126.04583,
      powerSource: 'EG/EB',
      yearBuilt: '1998',
    },
    // Category II
    {
      id: '5580,11',
      name: 'Ramsu Pu.Gunung Api Kisar',
      categoryId: cat2.id,
      latitude: -6.63694,
      longitude: 126.66444,
      powerSource: '-',
      yearBuilt: '-',
    },
    {
      id: '5895',
      name: 'Sarang Burung',
      categoryId: cat2.id,
      latitude: 0.25889,
      longitude: 127.01167,
      powerSource: 'EB',
      yearBuilt: '1991/2014',
    },
    // Category III
    {
      id: '5332',
      name: 'Ramsu Falabisahaya Hijau',
      categoryId: cat3.id,
      latitude: -1.77436,
      longitude: 125.50621,
      powerSource: 'EB',
      yearBuilt: '2014',
    },
    // Category IV
    {
      id: '5080',
      name: 'Ramsu Pel. Gorom',
      categoryId: cat4.id,
      latitude: -3.99528,
      longitude: 131.37694,
      powerSource: 'EB',
      yearBuilt: '2007',
    },
    // Category V
    {
      id: '5902,10',
      name: 'Alur Masuk Laiwui Merah',
      categoryId: cat5.id,
      latitude: -1.33233,
      longitude: 127.66629,
      powerSource: 'EB',
      yearBuilt: '2012',
    },
    // Category VI
    {
      id: '6401',
      name: 'W.Batu Gajah Estury',
      categoryId: cat6.id,
      latitude: -3.69528,
      longitude: 128.17406,
      powerSource: '-',
      yearBuilt: '2015',
    },
  ];

  for (const data of stationsData) {
    const station = await prisma.station.create({ data });
    console.log(`Created station: ${station.name}`);

    // Create 1 current report for each
    await prisma.report.create({
      data: {
        stationId: station.id,
        reportedAt: new Date(),
        issueStatus: data.id === '5580,11' ? IssueStatus.PADAM : IssueStatus.NIHIL,
        conditionPercent: data.id === '5580,11' ? 0 : 90,
        issueDuration: data.id === '5580,11' ? 31 : 0,
        note: data.id === '5580,11' ? 'ROBOH' : 'NORMAL',
      },
    });
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
