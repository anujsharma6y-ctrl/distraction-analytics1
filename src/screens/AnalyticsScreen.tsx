import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { fetchDailyStats, fetchGatewayStats, fetchWeeklySessions } from '../database';
import type { DailyAggregate, DistractionSession, GatewayStat } from '../types/session';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { formatDurationSeconds } from '../utils/formatDuration';

export default function AnalyticsScreen() {
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

  const averageDuration = sessions.length ? Math.round(totalDuration / sessions.length) : 0;
  const maxDuration = sessions.reduce((max, session) => Math.max(max, session.durationSeconds), 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.subtitle}>Daily viewing duration, gateway app patterns, and time-of-day trends.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Daily viewing duration</Text>
        <Text style={styles.value}>{formatDurationSeconds(totalDuration)}</Text>
        <Text style={styles.meta}>{sessions.length} tracked sessions</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Gateway ranking</Text>
        {gatewayStats.map((app, index) => (
          <View key={`${app.triggerApp}-${index}`} style={styles.row}>
            <Text style={styles.app}>{index + 1}. {app.triggerApp}</Text>
            <Text style={styles.appValue}>{app.share.toFixed(0)}%</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Session summary</Text>
        <Text style={styles.bullet}>Average session: {formatDurationSeconds(averageDuration)}</Text>
        <Text style={styles.bullet}>Longest session: {formatDurationSeconds(maxDuration)}</Text>
        <Text style={styles.bullet}>Available data points: {dailyStats.length}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Daily bars</Text>
        <View style={styles.barRow}>
          {dailyStats.slice(0, 7).reverse().map((day, index) => (
            <View key={`${day.date}-${index}`} style={styles.barGroup}>
              <View
                style={[
                  styles.bar,
                  { height: Math.max(8, (day.totalDurationSeconds / Math.max(...dailyStats.map((d) => d.totalDurationSeconds), 1)) * 100) }
                ]}
              />
              <Text style={styles.barLabel}>{String(new Date(day.date).getDate()).padStart(2, '0')}</Text>
            </View>
          ))}
        </View>
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
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: 14,
    lineHeight: 22
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.divider,
    borderWidth: 1,
    borderRadius: 18,
    padding: spacing.lg
  },
  label: {
    color: colors.secondaryText,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '700'
  },
  value: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '700',
    marginTop: 10
  },
  meta: {
    color: colors.accentSoft,
    fontSize: 12,
    marginTop: 8
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: colors.divider,
    borderBottomWidth: 1
  },
  app: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600'
  },
  appValue: {
    color: colors.accentSoft,
    fontSize: 14,
    fontWeight: '700'
  },
  bullet: {
    color: colors.secondaryText,
    fontSize: 14,
    marginTop: 10,
    lineHeight: 22
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 20,
    height: 120
  },
  barGroup: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    height: '100%'
  },
  bar: {
    width: 16,
    minHeight: 14,
    borderRadius: 8,
    backgroundColor: colors.accent,
    marginBottom: 8
  },
  barLabel: {
    color: colors.secondaryText,
    fontSize: 10
  }
});
