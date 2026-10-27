import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface StatCardProps {
  label: string;
  value: string;
  meta: string;
  accent?: boolean;
  onPress?: () => void;
}

export default function StatCard({ label, value, meta, accent = false, onPress }: StatCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        accent && styles.cardAccent,
        pressed && styles.cardPressed
      ]}
      accessibilityRole="button"
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.meta}>{meta}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 160,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 18,
    padding: spacing.lg,
    minHeight: 150,
    justifyContent: 'center'
  },
  cardAccent: {
    borderColor: 'rgba(243, 156, 18, 0.5)',
    backgroundColor: 'rgba(243, 156, 18, 0.08)'
  },
  cardPressed: {
    opacity: 0.9
  },
  label: {
    color: colors.secondaryText,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  value: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    marginTop: 10
  },
  meta: {
    marginTop: 8,
    color: colors.accentSoft,
    fontSize: 12,
    lineHeight: 18
  }
});
