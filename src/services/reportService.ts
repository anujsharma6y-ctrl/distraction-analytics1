import type { DailyAggregate, DistractionSession, GatewayStat } from '../types/session';

export function generateMarkdownReport(
  sessions: DistractionSession[],
  dailyStats: DailyAggregate[],
  gatewayStats: GatewayStat[]
): string {
  const totalDuration = sessions.reduce((sum, session) => sum + session.durationSeconds, 0);
  const sessionCount = sessions.length;
  const average = sessionCount > 0 ? Math.round(totalDuration / sessionCount) : 0;
  const longest = sessions.reduce((max, session) => Math.max(max, session.durationSeconds), 0);

  const dailyLines = dailyStats
    .slice(0, 7)
    .map((day) => `- ${day.date}: ${day.sessionCount} sessions · ${Math.round(day.totalDurationSeconds / 60)} minutes`)
    .join('\n');

  const gatewayLines = gatewayStats.length
    ? gatewayStats.map((app) => `- ${app.triggerApp}: ${app.sessionCount} sessions (${app.share.toFixed(1)}%)`).join('\n')
    : '- No known preceding apps recorded yet.';

  return `# Distraction Analytics — Weekly Report
**Period:** ${new Date().toISOString().slice(0, 10)} to ${new Date().toISOString().slice(0, 10)}

## Summary
- Total short-form time: ${formatMinutes(totalDuration)}
- Total sessions: ${sessionCount}
- Average session duration: ${formatMinutes(average)}
- Longest session: ${formatMinutes(longest)}

## Daily Breakdown
${dailyLines || '- No daily data yet.'}

## Most Frequent Preceding Apps
${gatewayLines}

## Notes
- Preceding apps indicate sequence, not confirmed causation.
- Statistics reflect detected and stored sessions only.
- The app intentionally keeps all data on-device.
`;
}

function formatMinutes(totalSeconds: number): string {
  const minutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }

  return `${minutes}m`;
}
