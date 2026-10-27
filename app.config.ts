import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Distraction Analytics',
  slug: 'distraction-analytics',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  splash: {
    backgroundColor: '#0A0F1D'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.example.distractionanalytics'
  },
  android: {
    package: 'com.example.distractionanalytics',
    adaptiveIcon: {
      backgroundColor: '#0A0F1D'
    }
  },
  extra: {
    privacyMode: 'local-only'
  }
};

export default config;
