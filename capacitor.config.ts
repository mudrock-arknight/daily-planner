import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.dailyplanner',
  appName: 'Daily Planner',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
