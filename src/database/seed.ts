import type { DistractionSession } from '../types/session';

export const demoSessions: DistractionSession[] = [
  {
    id: 'session-1',
    appName: 'YouTube Shorts',
    contentType: 'Shorts',
    triggerApp: 'Instagram',
    startTime: '2026-10-27T19:42:00.000Z',
    durationSeconds: 660,
    endTime: '2026-10-27T19:53:00.000Z',
    detectionSource: 'accessibility',
    createdAt: '2026-10-27T19:53:00.000Z'
  },
  {
    id: 'session-2',
    appName: 'Instagram Reels',
    contentType: 'Reels',
    triggerApp: 'Chrome',
    startTime: '2026-10-27T21:12:00.000Z',
    durationSeconds: 480,
    endTime: '2026-10-27T21:20:00.000Z',
    detectionSource: 'manual',
    createdAt: '2026-10-27T21:20:00.000Z'
  },
  {
    id: 'session-3',
    appName: 'YouTube Shorts',
    contentType: 'Shorts',
    triggerApp: 'Messages',
    startTime: '2026-10-26T20:10:00.000Z',
    durationSeconds: 960,
    endTime: '2026-10-26T20:26:00.000Z',
    detectionSource: 'accessibility',
    createdAt: '2026-10-26T20:26:00.000Z'
  }
];
