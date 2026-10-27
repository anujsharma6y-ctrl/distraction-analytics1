import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { fetchWeeklySessions } from '../database';
import type { DistractionSession } from '../types/session';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { formatClockLabel, formatDurationSeconds, formatDateLabel } from '../utils/formatDuration';

export default function SessionsScreen() {
  const [sessions, setSessions] = useState<DistractionSession[]>([]);

  useEffect(() => {
    setSessions(fetchWeeklySessions());
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Sessions</Text>
      <Text style={styles.subtitle}>Search, filter, and inspect detected short-form sessions.</Text>

      {sessions.map((session) => (
        <View key={session.id} style={styles.sessionCard}>
          <View>
            <Text style={styles.appName}>{session.appName}</Text>
            <Text style={styles.meta}>{session.contentType} · {formatDateLabel(session.startTime)}</Text>
          </View>
          <View style={styles.rightCol}>
            <Text style={styles.duration}>{formatDurationSeconds(session.durationSeconds)}</Text>
            <Text style={styles.source}>{formatClockLabel(session.startTime)}</Text>
          </View>
        </View>
      ))}
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
  sessionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.divider,
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.lg
  },
  appName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700'
  },
  meta: {
    color: colors.secondaryText,
    fontSize: 12,
    marginTop: 6
  },
  rightCol: {
    alignItems: 'flex-end'
  },
  duration: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700'
  },
  source: {
    color: colors.accentSoft,
    fontSize: 12,
    marginTop: 6
  }
});
