import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const ROOT = process.cwd();
export const STATE_PATH = join(ROOT, '.evalio-cloud.json');
export const SERVICE = 'evalio-api';
export const REGION = process.env.EVALIO_REGION ?? 'asia-south1';

export function loadState() {
  if (!existsSync(STATE_PATH)) return null;
  return JSON.parse(readFileSync(STATE_PATH, 'utf8'));
}

export function bin(name) {
  if (process.platform !== 'win32') return name;
  return name === 'gcloud' ? 'gcloud.cmd' : name;
}

export function run(command, args, { capture = false } = {}) {
  const result = spawnSync(bin(command), args, {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  });
  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || '').trim();
    throw new Error(err || `${command} ${args.join(' ')} failed`);
  }
  return (result.stdout ?? '').trim();
}

export function tryRun(command, args, opts = {}) {
  try {
    return run(command, args, opts);
  } catch {
    return '';
  }
}

export function gcloud(args, opts = {}) {
  return run('gcloud', args, opts);
}

export function projectId() {
  const fromEnv =
    process.env.CLOUDSDK_CORE_PROJECT || process.env.GOOGLE_CLOUD_PROJECT;
  if (fromEnv) return fromEnv;
  const value = gcloud(['config', 'get-value', 'project'], { capture: true });
  if (!value || value === '(unset)') {
    throw new Error(
      'No active gcloud project. Run gcloud config set project …',
    );
  }
  return value;
}
