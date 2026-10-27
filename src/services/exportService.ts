import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { fetchDailyStats, fetchGatewayStats, fetchWeeklySessions } from '../database';
import { generateMarkdownReport } from './reportService';

const documentDirectory = (FileSystem as any).documentDirectory ?? '';

export async function exportMarkdownReport(): Promise<string | null> {
  const sessions = fetchWeeklySessions();
  const dailyStats = fetchDailyStats();
  const gatewayStats = fetchGatewayStats();
  const markdown = generateMarkdownReport(sessions, dailyStats, gatewayStats);

  const uri = `${documentDirectory}distraction-report.md`;
  await FileSystem.writeAsStringAsync(uri, markdown, {
    encoding: FileSystem.EncodingType.UTF8
  });

  if (!(await Sharing.isAvailableAsync())) {
    return uri;
  }

  await Sharing.shareAsync(uri, {
    mimeType: 'text/markdown',
    dialogTitle: 'Share distraction analytics report'
  });

  return uri;
}

export async function exportJsonSessions(): Promise<string | null> {
  const sessions = fetchWeeklySessions();
  const uri = `${documentDirectory}distraction-sessions.json`;
  await FileSystem.writeAsStringAsync(uri, JSON.stringify(sessions, null, 2), {
    encoding: FileSystem.EncodingType.UTF8
  });

  if (!(await Sharing.isAvailableAsync())) {
    return uri;
  }

  await Sharing.shareAsync(uri, {
    mimeType: 'application/json',
    dialogTitle: 'Share session export'
  });

  return uri;
}
