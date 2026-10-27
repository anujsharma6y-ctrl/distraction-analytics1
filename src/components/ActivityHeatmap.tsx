import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

interface ActivityHeatmapProps {
  values?: number[];
}

export default function ActivityHeatmap({ values = [0, 0, 1, 2, 1, 0, 0, 0, 1, 3, 2, 0, 0, 1, 2, 0, 0, 1, 3, 2, 1, 0, 0, 1, 4, 2, 1, 0] }: ActivityHeatmapProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.legendRow}>
        <Text style={styles.legendText}>Low</Text>
        <View style={styles.legendScale}>
          {[0, 1, 2, 3, 4].map((level) => (
            <View
              key={level}
              style={[styles.legendCell, { backgroundColor: getLevelColor(level) }]}
            />
          ))}
        </View>
        <Text style={styles.legendText}>High</Text>
      </View>

      <View style={styles.grid}>
        {values.map((value, index) => {
          const selected = selectedIndex === index;
          return (
            <Pressable
              key={`${value}-${index}`}
              onPress={() => setSelectedIndex(selected ? null : index)}
              style={[
                styles.cell,
                { backgroundColor: getLevelColor(value) },
                selected && styles.cellSelected
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Day ${index + 1}, ${value} intensity`}
            />
          );
        })}
      </View>

      {selectedIndex !== null ? (
        <Text style={styles.summaryText}>
          Selected day: {selectedIndex + 1} · {values[selectedIndex] ?? 0} intensity units
        </Text>
      ) : (
        <Text style={styles.summaryText}>Tap a day to inspect a detail summary.</Text>
      )}
    </View>
  );
}

function getLevelColor(level: number) {
  const palette = ['#1F2937', '#24354a', '#2d4d6b', '#38607d', '#F39C12'];
  return palette[level] ?? palette[0];
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  legendText: {
    color: colors.secondaryText,
    fontSize: 11
  },
  legendScale: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 4
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  cell: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)'
  },
  cellSelected: {
    borderColor: colors.accentSoft,
    borderWidth: 2
  },
  summaryText: {
    marginTop: 12,
    color: colors.secondaryText,
    fontSize: 12
  }
});
