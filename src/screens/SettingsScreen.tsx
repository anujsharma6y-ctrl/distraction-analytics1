import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { clearAllSessions, fetchDailyStats, fetchGatewayStats, fetchWeeklySessions } from '../database';
import { exportJsonSessions, exportMarkdownReport } from '../services/exportService';
import { generateMarkdownReport } from '../services/reportService';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function SettingsScreen() {
  const handleExportMarkdown = async () => {
    try {
      await exportMarkdownReport();
      Alert.alert('Report exported', 'Your weekly report has been generated and shared when available.');
    } catch (error) {
      Alert.alert('Report failed', error instanceof Error ? error.message : 'Unknown export error');
    }
  };

  const handleExportJson = async () => {
    try {
      await exportJsonSessions();
      Alert.alert('Data exported', 'Your local session export is ready to share.');
    } catch (error) {
      Alert.alert('Export failed', error instanceof Error ? error.message : 'Unknown export error');
    }
  };

  const handleClearData = () => {
    Alert.alert('Clear all local data', 'This removes all saved session data from this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          clearAllSessions();
          Alert.alert('Data cleared', 'All stored distraction sessions were removed from this device.');
        }
      }
    ]);
  };

  const previewReport = generateMarkdownReport(fetchWeeklySessions(), fetchDailyStats(), fetchGatewayStats());

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Privacy, permissions, and local data controls.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Permission status</Text>
        <Text style={styles.value}>Accessibility enabled</Text>
        <Text style={styles.meta}>Granted locally · no cloud sync · no external upload</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Privacy</Text>
        <Text style={styles.bullet}>Data remains on this device.</Text>
        <Text style={styles.bullet}>No mandatory account required.</Text>
        <Text style={styles.bullet}>Only feed entry and exit events are used for session timing.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Data management</Text>
        <Pressable style={styles.actionButton} onPress={handleExportMarkdown}>
          <Text style={styles.actionText}>Generate Markdown Report</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={handleExportJson}>
          <Text style={styles.actionText}>Export Local JSON</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.dangerButton]} onPress={handleClearData}>
          <Text style={styles.actionText}>Clear All Sessions</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Retention policy</Text>
        <Text style={styles.bullet}>Stored sessions remain on-device until the user deletes them.</Text>
        <Text style={styles.bullet}>The app never uploads personal app histories to a remote service.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Report preview</Text>
        <Text style={styles.preview}>{previewReport.slice(0, 220)}...</Text>
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
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase'
  },
  value: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 10
  },
  meta: {
    color: colors.accentSoft,
    fontSize: 12,
    marginTop: 8
  },
  bullet: {
    color: colors.secondaryText,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8
  },
  actionButton: {
    marginTop: 12,
    backgroundColor: colors.secondarySurface,
    borderColor: colors.divider,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14
  },
  dangerButton: {
    backgroundColor: 'rgba(248, 113, 113, 0.08)',
    borderColor: 'rgba(248, 113, 113, 0.35)'
  },
  actionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center'
  },
  preview: {
    color: colors.secondaryText,
    fontSize: 12,
    lineHeight: 20,
    marginTop: 12
  }
});
