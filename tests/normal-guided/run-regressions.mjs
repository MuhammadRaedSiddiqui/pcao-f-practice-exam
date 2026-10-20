import { spawn } from 'node:child_process';
import fs from 'node:fs';
const folder = 'test-results/guided-mode-20261019-01/';
const results = [];
const runs = [
  ...['disabled', 'empty'].map(kind => ({ name: kind, config: 'playwright.config.ts', env: { GUIDED_QA_KIND: kind } })),
  ...['guided', 'd12', 'guest', 'account', 'analytics', 'recovery', 'guided-analytics'].map(suite => ({ name: suite, config: 'regression.config.ts', env: { GUIDED_REGRESSION: suite } })),
];
for (const run of runs) {
  const fd = fs.openSync(folder + run.name + '-run.log', 'wx');
  console.log('START ' + run.name);
  const code = await new Promise(resolve => { const child = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', '--config', 'tests/normal-guided/' + run.config], { stdio: ['ignore', fd, fd], windowsHide: true, env: { ...process.env, ...run.env } }); child.on('exit', resolve); });
  fs.closeSync(fd); results.push({ suite: run.name, exitCode: code });
  fs.writeFileSync(folder + 'regression-exits.json', JSON.stringify(results, null, 2));
  console.log('END ' + run.name + ' ' + code);
}
