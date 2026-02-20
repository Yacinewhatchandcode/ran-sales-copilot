import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yace19ai.ran',
  appName: 'RAN Sales Co-Pilot',
  webDir: 'public',
  server: {
    url: 'https://ran-sales-copilot.vercel.app',
    cleartext: true
  }
};

export default config;
