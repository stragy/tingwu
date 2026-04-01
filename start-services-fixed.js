const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const LOG_DIR = path.join(ROOT, 'logs');
const ENV_FILE = path.join(ROOT, '.env');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const env = { ...process.env };
if (fs.existsSync(ENV_FILE)) {
  const lines = fs.readFileSync(ENV_FILE, 'utf8').split('\n');
  for (const line of lines) {
    const m = line.match(/^\s*([^#][^=]*?)\s*=\s*(.*)\s*$/);
    if (m) env[m[1].trim()] = m[2].trim();
  }
}

const services = [
  { name: 'auth-service', port: 3001, script: 'packages/auth-service/dist/index.js' },
  { name: 'user-service', port: 3002, script: 'packages/user-service/dist/index.js' },
  { name: 'practice-service', port: 3003, script: 'packages/practice-service/dist/index.js' },
  { name: 'evaluation-service', port: 8084, script: 'packages/evaluation-service/dist/index.js' },
  { name: 'scheduling-service', port: 8085, script: 'packages/scheduling-service/dist/index.js' },
  { name: 'analytics-service', port: 8086, script: 'packages/analytics-service/dist/index.js' },
];

const checkPort = (port) =>
  new Promise((resolve) => {
    const net = require('net');
    const s = net.createConnection({ port, host: '127.0.0.1' });
    s.on('connect', () => {
      s.destroy();
      resolve(true);
    });
    s.on('error', () => resolve(false));
    s.setTimeout(500, () => {
      s.destroy();
      resolve(false);
    });
  });

async function startService(svc) {
  const already = await checkPort(svc.port);
  if (already) {
    console.log(`[SKIP] ${svc.name} already running on :${svc.port}`);
    return null;
  }

  const logFile = path.join(LOG_DIR, `${svc.name}.log`);
  const scriptPath = path.join(ROOT, svc.script);

  const serviceEnv = { ...env, PORT: svc.port.toString() };
  console.log(`[START] ${svc.name} -> :${svc.port}  (log: logs/${svc.name}.log)`);

  const child = spawn(process.execPath, [scriptPath], {
    cwd: ROOT,
    env: serviceEnv,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false,
  });

  const logStream = fs.createWriteStream(logFile, { flags: 'w', encoding: 'utf8' });
  child.stdout.on('data', (d) => logStream.write(d.toString()));
  child.stderr.on('data', (d) => logStream.write('[ERR] ' + d.toString()));
  child.on('close', (code) => {
    logStream.write(`\n[EXIT] code=${code}\n`);
    logStream.end();
  });
  child.on('error', (e) => console.error(`[ERROR] ${svc.name}: ${e.message}`));

  return child;
}

async function main() {
  console.log('=== Starting Tingwu Backend Services ===\n');

  const procs = [];
  for (const svc of services) {
    const p = await startService(svc);
    if (p) procs.push({ name: svc.name, proc: p });
  }

  console.log('\nWaiting 5s for services to initialize...');
  await new Promise((r) => setTimeout(r, 5000));

  console.log('\n=== Port Status ===');
  for (const svc of services) {
    const up = await checkPort(svc.port);
    console.log(
      `  ${svc.name.padEnd(22)} :${svc.port}  ${up ? '[OK]' : '[FAILED - check logs/' + svc.name + '.log]'}`
    );
  }

  console.log('\nAll services launched. Press Ctrl+C to stop.\n');

  process.on('SIGINT', () => {
    console.log('\nStopping services...');
    procs.forEach(({ proc }) => proc.kill());
    process.exit(0);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
