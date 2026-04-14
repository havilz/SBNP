import { IssueStatus } from '@prisma/client';

export type IssueStatusLabel =
  | 'NORMAL'
  | 'OFF'
  | 'WARNING'
  | 'CRITICAL'
  | 'UNKNOWN';
export type IssueStatusColor = 'green' | 'red' | 'orange' | 'darkred' | 'gray';

export interface MappedStatus {
  label: IssueStatusLabel;
  color: IssueStatusColor;
  raw: IssueStatus;
}

export const ISSUE_STATUS_MAPPING: Record<
  IssueStatus,
  Omit<MappedStatus, 'raw'>
> = {
  [IssueStatus.NIHIL]: { label: 'NORMAL', color: 'green' },
  [IssueStatus.PADAM]: { label: 'OFF', color: 'red' },
  [IssueStatus.RUSAK_RINGAN]: { label: 'WARNING', color: 'orange' },
  [IssueStatus.RUSAK_BERAT]: { label: 'CRITICAL', color: 'darkred' },
  [IssueStatus.UNKNOWN]: { label: 'UNKNOWN', color: 'gray' },
};
