import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import OverviewScreen from './src/screens/OverviewScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import SessionsScreen from './src/screens/SessionsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { initDatabase } from './src/database';
import { colors } from './src/theme/colors';

export type RootTabParamList = {
  Overview: undefined;
  Analytics: undefined;
  Sessions: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          initialRouteName="Overview"
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopColor: colors.divider,
              borderTopWidth: 1,
              height: 72,
              paddingBottom: 8,
              paddingTop: 8
            },
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.secondaryText,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600'
            }
          }}
        >
          <Tab.Screen name="Overview" component={OverviewScreen} />
          <Tab.Screen name="Analytics" component={AnalyticsScreen} />
          <Tab.Screen name="Sessions" component={SessionsScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
