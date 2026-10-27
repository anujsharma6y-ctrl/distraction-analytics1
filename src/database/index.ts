import * as SQLite from 'expo-sqlite';

import { DIStractionSessionIndexes, DIStractionSessionsTableSql } from './schema';
import { demoSessions } from './seed';
import type { DailyAggregate, DistractionSession, GatewayStat } from '../types/session';

const database = SQLite.openDatabaseSync('distraction-analytics.db');

export function initDatabase(): void {
  database.execSync(DIStractionSessionsTableSql);
  for (const indexSql of DIStractionSessionIndexes) {
    database.execSync(indexSql);
  }

  const existingRowCount = database.getFirstSync<{ count: number }>(`SELECT COUNT(*) AS count FROM distraction_sessions`);
  if ((existingRowCount?.count ?? 0) === 0) {
    demoSessions.forEach((session) => logSession(session));
  }
}

export function logSession(session: DistractionSession): void {
  database.runSync(
    `
      INSERT INTO distraction_sessions (
        id, appName, contentType, triggerApp, startTime, durationSeconds, endTime, detectionSource, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      session.id,
      session.appName,
      session.contentType,
      session.triggerApp,
      session.startTime,
      session.durationSeconds,
      session.endTime,
      session.detectionSource,
      session.createdAt
    ]
  );
}

export function fetchWeeklySessions(): DistractionSession[] {
  return database.getAllSync<DistractionSession>(`SELECT * FROM distraction_sessions ORDER BY startTime DESC LIMIT 10`);
}

export function fetchDailyStats(): DailyAggregate[] {
  const rows = database.getAllSync<{ date: string; totalDurationSeconds: number; sessionCount: number }>(`
    SELECT date(startTime) AS date, SUM(durationSeconds) AS totalDurationSeconds, COUNT(*) AS sessionCount
    FROM distraction_sessions
    GROUP BY date(startTime)
    ORDER BY date DESC
    LIMIT 28
  `);

  return rows.map((row) => ({
    date: row.date,
    totalDurationSeconds: Number(row.totalDurationSeconds ?? 0),
    sessionCount: Number(row.sessionCount ?? 0)
  }));
}

export function fetchGatewayStats(): GatewayStat[] {
  const rows = database.getAllSync<{ triggerApp: string; sessionCount: number }>(`
    SELECT triggerApp, COUNT(*) AS sessionCount
    FROM distraction_sessions
    WHERE triggerApp IS NOT NULL
    GROUP BY triggerApp
    ORDER BY sessionCount DESC
    LIMIT 5
  `);

  const total = rows.reduce((sum, row) => sum + Number(row.sessionCount ?? 0), 0);

  return rows.map((row) => ({
    triggerApp: row.triggerApp,
    sessionCount: Number(row.sessionCount ?? 0),
    share: total > 0 ? (Number(row.sessionCount ?? 0) / total) * 100 : 0
  }));
}

export function fetchHeatmapData(): DailyAggregate[] {
  return fetchDailyStats();
}

export function updateSession(id: string, changes: Partial<DistractionSession>): void {
  const entries = Object.entries(changes)
    .filter(([, value]) => value !== undefined)
    .map(([key]) => `${key} = ?`)
    .join(', ');

  const values = Object.values(changes).filter((value) => value !== undefined);

  if (!entries || values.length === 0) {
    return;
  }

  database.runSync(`UPDATE distraction_sessions SET ${entries} WHERE id = ?`, [...values, id]);
}

export function deleteSession(id: string): void {
  database.runSync('DELETE FROM distraction_sessions WHERE id = ?', [id]);
}

export function exportSessions(): DistractionSession[] {
  return fetchWeeklySessions();
}

export function clearAllSessions(): void {
  database.runSync('DELETE FROM distraction_sessions');
}
