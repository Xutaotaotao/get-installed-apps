import * as os from 'os';

const platform = os.platform();

console.log(`Running tests for platform: ${platform}`);

if (platform === 'win32') {
  console.log('Running Windows tests...');
  require('./test-win.ts');
} else if (platform === 'darwin') {
  console.log('Running macOS tests...');
  require('./test-mac.ts');
} else if (platform === 'linux') {
  console.log('Running Linux tests...');
  require('./test-linux.ts');
} else {
  console.log(`Unsupported platform: ${platform}. Running Linux tests as fallback...`);
  require('./test-linux.ts');
}