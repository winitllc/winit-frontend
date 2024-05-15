import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.whatsinit.app',
  appName: 'WINIT',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
