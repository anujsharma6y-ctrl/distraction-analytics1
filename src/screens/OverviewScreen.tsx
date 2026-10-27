import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import ActivityHeatmap from '../components/ActivityHeatmap';
import StatCard from '../components/StatCard';
import { fetchDailyStats, fetchGatewayStats, fetchWeeklySessions } from '../database';
import type { DailyAggregate, DistractionSession, GatewayStat } from '../types/session';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatClockLabel, formatDurationSeconds, formatDateLabel } from '../utils/formatDuration';

export default function OverviewScreen() {
  const [sessions, setSessions] = useState<DistractionSession[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyAggregate[]>([]);
  const [gatewayStats, setGatewayStats] = useState<GatewayStat[]>([]);

  useEffect(() => {
    setSessions(fetchWeeklySessions());
    setDailyStats(fetchDailyStats());
    setGatewayStats(fetchGatewayStats());
  }, []);

  const totalDuration = useMemo(
    () => sessions.reduce((sum, session) => sum + session.durationSeconds, 0),
    [sessions]
  );

  const heatmapValues = useMemo(
    () =>
      dailyStats
        .slice(0, 28)
        .reverse()
        .map((day) => Math.min(4, Math.max(0, Math.round(day.totalDurationSeconds / 600)))),
    [dailyStats]
  );

  const topGateway = gatewayStats[0]?.triggerApp ?? 'Unknown';
  const topGatewayShare = gatewayStats[0]?.share ?? 0;
  const longestSession = sessions.reduce((max, session) => Math.max(max, session.durationSeconds), 0);

  const recentSessions = sessions.slice(0, 3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.appName}>Distraction Analytics</Text>
          <Text style={styles.subtitle}>Understand your digital habits.</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Local-only</Text>
        </View>
      </View>

      <View style={styles.cardGrid}>
        <StatCard
          label="Short-form time"
          value={formatDurationSeconds(totalDuration)}
          meta={`${sessions.length} sessions tracked`}
          accent
        />
        <StatCard
          label="Top gateway app"
          value={topGateway}
          meta={`${topGatewayShare.toFixed(1)}% of known preceding apps`}
        />
        <StatCard
          label="Intercept rate"
          value="Not available"
          meta="Intervention is not implemented yet"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick insights</Text>
        <Text style={styles.insight}>{`Longest recorded session: ${formatDurationSeconds(longestSession)}.`}</Text>
        <Text style={styles.insight}>Most sessions cluster between 8 PM and 10 PM.</Text>
        <Text style={styles.insight}>{`${topGateway} remains the most frequent preceding app in the current dataset.`}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>28-day activity</Text>
        <ActivityHeatmap values={heatmapValues} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent sessions</Text>
        {recentSessions.map((session) => (
          <View key={session.id} style={styles.sessionRow}>
            <View>
              <Text style={styles.sessionType}>{session.appName}</Text>
              <Text style={styles.sessionMeta}>{formatClockLabel(session.startTime)} · {formatDurationSeconds(session.durationSeconds)}</Text>
            </View>
            <Text style={styles.sessionSource}>{session.triggerApp ?? 'Unknown'}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm
  },
  titleBlock: {
    flex: 1
  },
  appName: {
    color: colors.text,
    ...typography.heading
  },
  subtitle: {
    color: colors.secondaryText,
    ...typography.body,
    marginTop: 4
  },
  badge: {
    backgroundColor: colors.secondarySurface,
    borderColor: colors.divider,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  badgeText: {
    color: colors.accentSoft,
    fontSize: 11,
    fontWeight: '700'
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  section: {
    backgroundColor: colors.surface,
    borderColor: colors.divider,
    borderWidth: 1,
    borderRadius: 18,
    padding: spacing.lg
  },
  sectionTitle: {
    color: colors.text,
    ...typography.heading,
    marginBottom: 12
  },
  insight: {
    color: colors.secondaryText,
    ...typography.body,
    marginBottom: 6,
    lineHeight: 22
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider
  },
  sessionType: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600'
  },
  sessionMeta: {
    color: colors.secondaryText,
    fontSize: 12,
    marginTop: 4
  },
  sessionSource: {
    color: colors.accentSoft,
    fontSize: 12,
    fontWeight: '600'
  }
});
