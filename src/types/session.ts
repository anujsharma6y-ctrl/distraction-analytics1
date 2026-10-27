export type ContentType = 'Shorts' | 'Reels' | 'Longform' | 'DM' | 'Unknown';
export type DetectionSource = 'accessibility' | 'manual' | 'imported';

export interface DistractionSession {
  id: string;
  appName: string;
  contentType: ContentType;
  triggerApp: string | null;
  startTime: string;
  durationSeconds: number;
  endTime: string | null;
  detectionSource: DetectionSource;
  createdAt: string;
}

export type DailyAggregate = {
  date: string;
  totalDurationSeconds: number;
  sessionCount: number;
};

export type GatewayStat = {
  triggerApp: string;
  sessionCount: number;
  share: number;
};
