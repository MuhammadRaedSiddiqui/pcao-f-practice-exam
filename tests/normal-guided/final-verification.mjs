import { spawn } from 'node:child_process';
import fs from 'node:fs';
const root = 'test-results/guided-mode-20261019-01/';
const commands = [
  { name: 'typecheck-closeout', args: ['node_modules/typescript/bin/tsc', '--noEmit'] },
  { name: 'build-publication-guard', args: ['tests/normal-guided/build.mjs'] },
  ...['disabled', 'empty'].map(kind => ({ name: kind + '-guard-final', args: ['node_modules/@playwright/test/cli.js', 'test', '--config', 'tests/normal-guided/playwright.config.ts'], env: { GUIDED_QA_KIND: kind, GUIDED_QA_RUN: 'guard-final' } })),
  ...['guided-analytics', 'guided'].map(suite => ({ name: suite + '-confirmed', args: ['node_modules/@playwright/test/cli.js', 'test', '--config', 'tests/normal-guided/regression.config.ts'], env: { GUIDED_REGRESSION: suite, GUIDED_QA_RUN: 'confirmed' } })),
  { name: 'retained-candidate', args: ['node_modules/@playwright/test/cli.js', 'test', '--config', 'tests/normal-guided/candidate.config.ts'] },
  { name: 'units-closeout', args: ['node_modules/vitest/vitest.mjs', 'run', '--configLoader', 'runner', '--maxWorkers', '1'] },
];
const results = [];
for (const cmd of commands) {
  const fd = fs.openSync(root + cmd.name + '.log', 'wx'); console.log('START ' + cmd.name);
  const exitCode = await new Promise(resolve => { const child = spawn(process.execPath, cmd.args, { stdio: ['ignore', fd, fd], windowsHide: true, env: { ...process.env, ...cmd.env } }); child.on('exit', resolve); });
  fs.closeSync(fd); results.push({ command: cmd.name, args: cmd.args, exitCode }); fs.writeFileSync(root + 'final-verification-exits.json', JSON.stringify(results, null, 2)); console.log('END ' + cmd.name + ' ' + exitCode);
}
