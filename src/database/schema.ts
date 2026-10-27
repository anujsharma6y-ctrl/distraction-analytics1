export const DIStractionSessionsTableSql = `
  CREATE TABLE IF NOT EXISTS distraction_sessions (
    id TEXT PRIMARY KEY,
    appName TEXT NOT NULL,
    contentType TEXT NOT NULL CHECK(contentType IN ('Shorts', 'Reels', 'Longform', 'DM', 'Unknown')),
    triggerApp TEXT,
    startTime TEXT NOT NULL,
    durationSeconds INTEGER NOT NULL CHECK(durationSeconds >= 0),
    endTime TEXT,
    detectionSource TEXT NOT NULL CHECK(detectionSource IN ('accessibility', 'manual', 'imported')),
    createdAt TEXT NOT NULL
  );
`;

export const DIStractionSessionIndexes = [
  'CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON distraction_sessions(startTime);',
  'CREATE INDEX IF NOT EXISTS idx_sessions_app_name ON distraction_sessions(appName);',
  'CREATE INDEX IF NOT EXISTS idx_sessions_content_type ON distraction_sessions(contentType);',
  'CREATE INDEX IF NOT EXISTS idx_sessions_trigger_app ON distraction_sessions(triggerApp);'
];
