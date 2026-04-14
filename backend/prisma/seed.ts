import { PrismaClient, IssueStatus } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

const adapter = new PrismaBetterSqlite3({
    url: 'file:./prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing database...');
  await prisma.report.deleteMany();
  await prisma.station.deleteMany();
  await prisma.category.deleteMany();

  const dataPath = path.join(__dirname, 'data', 'stations_data.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const categoriesData = JSON.parse(rawData);

  console.log('Seeding categories and stations...');

  for (let i = 0; i < categoriesData.length; i++) {
    const catData = categoriesData[i];
    const categoryName = catData.category.split('. ')[1] || catData.category;
    const roman = catData.category.split('. ')[0] || 'I';
    
    const category = await prisma.category.create({
      data: {
        name: categoryName,
        roman: roman,
        displayOrder: i + 1,
      },
    });

    console.log(`Processing category: ${category.roman} ${category.name} (${catData.stations.length} stations)`);

    for (const st of catData.stations) {
      const station = await prisma.station.create({
        data: {
          id: st.id,
          name: st.name,
          categoryId: category.id,
          latitude: st.lat,
          longitude: st.lng,
          powerSource: st.power,
          yearBuilt: st.year,
        },
      });

      // Create the initial report based on PDF status
      await prisma.report.create({
        data: {
          stationId: station.id,
          reportedAt: new Date('2026-01-31T23:59:59Z'), // January 2026 Report
          issueStatus: st.status as IssueStatus,
          issueDuration: st.dur,
          issueCause: st.status !== 'NIHIL' ? st.note : null,
          conditionPercent: st.cond,
          note: st.note,
        },
      });
    }
  }

  console.log('Seeding completed! Total 205 units entered.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
