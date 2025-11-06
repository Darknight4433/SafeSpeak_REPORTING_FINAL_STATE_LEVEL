import { ref, get, set } from 'firebase/database';
import { database } from './firebase';

export async function getNextReportNumber(): Promise<number> {
  const counterRef = ref(database, 'reportCounter');
  const snapshot = await get(counterRef);
  const currentCount = snapshot.val() || 0;
  const nextCount = currentCount + 1;
  await set(counterRef, nextCount);
  return nextCount;
}

export function formatReportId(reportNumber: number): string {
  return `no${reportNumber}`;
}

export function parseReportId(reportId: string): number {
  return parseInt(reportId.replace('no', ''), 10);
}
