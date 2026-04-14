import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/providers/prisma.service';
import * as ExcelJS from 'exceljs';
import { ISSUE_STATUS_MAPPING } from '../../common/constants/status-mapping.constants';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  async exportExcel() {
    const categories = await this.prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        stations: {
          include: {
            reports: {
              orderBy: { reportedAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Kelainan SBNP');

    // --- 1. Header Section ---
    worksheet.mergeCells('A1:C1');
    worksheet.getCell('A1').value = 'KEMENTERIAN PERHUBUNGAN';
    worksheet.getCell('A1').font = { bold: true, size: 10 };

    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').value = 'DIREKTORAT JENDERAL PERHUBUNGAN LAUT';
    worksheet.getCell('A2').font = { bold: true, size: 10 };

    worksheet.mergeCells('A3:C3');
    worksheet.getCell('A3').value = 'DISTRIK NAVIGASI TIPE A KELAS I AMBON';
    worksheet.getCell('A3').font = { bold: true, size: 10 };

    worksheet.mergeCells('G1:J1');
    worksheet.getCell('G1').value = 'LAPORAN KELAINAN SBNP';
    worksheet.getCell('G1').font = { bold: true, size: 11 };
    worksheet.getCell('G1').alignment = { horizontal: 'right' };

    worksheet.mergeCells('G2:J2');
    const monthYear = new Date()
      .toLocaleString('id-ID', { month: 'long', year: 'numeric' })
      .toUpperCase();
    worksheet.getCell('G2').value = `BULAN : ${monthYear}`;
    worksheet.getCell('G2').font = { bold: true, size: 10 };
    worksheet.getCell('G2').alignment = { horizontal: 'right' };

    worksheet.mergeCells('E4:F4');
    worksheet.getCell('E4').value = 'MILIK DJPL';
    worksheet.getCell('E4').alignment = { horizontal: 'center' };
    worksheet.getCell('E4').font = { bold: true };

    // --- 2. Table Header ---
    const headerRow = worksheet.getRow(6);
    const headers = [
      'NO',
      'DSI',
      'JENIS / NAMA SBNP',
      'POSISI',
      'SUMBER TENAGA',
      'PENYEBAB KELAINAN',
      'JUMLAH HARI KELAINAN',
      'TAHUN PEMBUATAN',
      'KONDISI',
      'KET',
    ];
    headerRow.values = headers;
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

    // Header Style (Borders)
    for (let i = 1; i <= 10; i++) {
      const cell = headerRow.getCell(i);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }

    // Sub-header NO (1-10)
    const subHeaderRow = worksheet.getRow(7);
    for (let i = 1; i <= 10; i++) {
      subHeaderRow.getCell(i).value = i;
      subHeaderRow.getCell(i).alignment = { horizontal: 'center' };
      subHeaderRow.getCell(i).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }

    // Column Widths
    worksheet.getColumn(1).width = 5; // NO
    worksheet.getColumn(2).width = 10; // DSI
    worksheet.getColumn(3).width = 35; // NAME
    worksheet.getColumn(4).width = 30; // POSITION
    worksheet.getColumn(5).width = 10; // POWER
    worksheet.getColumn(6).width = 15; // CAUSE
    worksheet.getColumn(7).width = 12; // DAYS
    worksheet.getColumn(8).width = 12; // YEAR
    worksheet.getColumn(9).width = 10; // CONDITION
    worksheet.getColumn(10).width = 25; // NOTE

    // --- 3. Table Content by Category ---
    let currentRow = 8;

    // Filter categories to show only I to V in the main table
    const tableCategories = categories.filter((c) => c.displayOrder <= 5);

    tableCategories.forEach((cat) => {
      // Category Header Row
      const catRowIndex = currentRow++;
      const catRow = worksheet.getRow(catRowIndex);
      catRow.getCell(1).value = `${cat.roman}. ${cat.name}`;
      catRow.getCell(1).font = { bold: true };
      worksheet.mergeCells(catRowIndex, 1, catRowIndex, 10);

      cat.stations.forEach((station, index) => {
        const row = worksheet.getRow(currentRow++);
        const latestReport = station.reports[0];

        row.values = [
          index + 1,
          station.id,
          station.name,
          `${station.latitude}, ${station.longitude}`,
          station.powerSource || '-',
          latestReport
            ? ISSUE_STATUS_MAPPING[latestReport.issueStatus]?.label ||
              latestReport.issueStatus
            : 'UNKNOWN',
          latestReport?.issueDuration || '-',
          station.yearBuilt || '-',
          latestReport ? `${latestReport.conditionPercent}%` : '-',
          latestReport?.note || '-',
        ];

        // Borders and alignment
        row.eachCell((cell, colNum) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          if ([1, 2, 5, 6, 7, 8, 9].includes(colNum)) {
            cell.alignment = { horizontal: 'center' };
          }
        });
      });

      // Add empty row after each category
      currentRow++;
    });

    // --- 4. Summary Footer (Categories I to VI) ---
    currentRow += 1;
    const summaryStartRow = currentRow;

    worksheet.getCell(`A${currentRow}`).value = 'Jumlah SBNP yang bersuar:';
    worksheet.getCell(`A${currentRow}`).font = { bold: true };
    currentRow++;

    let totalUnits = 0;
    let totalOff = 0;
    let totalMalfunctionDays = 0;

    for (const cat of categories) {
      const count = cat.stations.length;
      totalUnits += count;

      // Calculate malfunctions
      cat.stations.forEach((s) => {
        const r = s.reports[0];
        if (r) {
          if (r.issueStatus !== 'NIHIL') totalOff++;
          totalMalfunctionDays += r.issueDuration || 0;
        }
      });

      const row = worksheet.getRow(currentRow++);
      row.getCell(1).value =
        `${cat.name.charAt(0) + cat.name.slice(1).toLowerCase()}`;
      row.getCell(3).value = `: ${count} Unit`;
    }

    // Add Category VI (Tanda Siang) manually since it's not in DB
    const tsRow = worksheet.getRow(currentRow++);
    tsRow.getCell(1).value = 'Tanda siang';
    tsRow.getCell(3).value = ': 10 Unit';
    totalUnits += 10;

    currentRow++;

    // Right side summary
    worksheet.getCell(`E${summaryStartRow}`).value =
      'Jumlah SBNP bersuar (JSB)';
    worksheet.getCell(`F${summaryStartRow}`).value =
      `: ${totalUnits - 10} unit`; // Subtract Tanda Siang

    worksheet.getCell(`E${summaryStartRow + 1}`).value =
      'Jumlah SBNP yang padam (JSBP)';
    worksheet.getCell(`F${summaryStartRow + 1}`).value = `: ${totalOff} unit`;

    worksheet.getCell(`E${summaryStartRow + 3}`).value =
      'Jumlah Hari Kelainan (JHK)';
    worksheet.getCell(`F${summaryStartRow + 3}`).value =
      `: ${totalMalfunctionDays} hari`;

    // Global Total
    worksheet.getCell(`E${summaryStartRow + 5}`).value = 'TOTAL SBNP';
    worksheet.getCell(`F${summaryStartRow + 5}`).value = `: ${totalUnits} unit`;
    worksheet.getCell(`E${summaryStartRow + 5}`).font = { bold: true };
    worksheet.getCell(`F${summaryStartRow + 5}`).font = { bold: true };

    return workbook.xlsx.writeBuffer();
  }

  async exportCsv(): Promise<string> {
    // Dummy as requested focus is Excel, but I'll keep it simple
    return Promise.resolve('Not implemented for formal format');
  }
}
