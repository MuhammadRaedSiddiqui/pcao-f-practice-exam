import { mergeConfig } from 'vite';
import accountConfig from './vite.account-test.config';

export default mergeConfig(accountConfig, {
  cacheDir: 'test-results/vite-recovery-cache',
});
