import { writeFileSync } from 'node:fs';
import {
  gcloud,
  projectId,
  REGION,
  SERVICE,
  STATE_PATH,
  tryRun,
} from './cloud-lib.mjs';

const project = projectId();

console.log(`Deploying ${SERVICE} to ${project} / ${REGION}`);
console.log('Caps: max-instances=1, min=0, 1Gi, 15s timeout, 10 concurrent.');

gcloud([
  'services',
  'enable',
  'run.googleapis.com',
  'cloudbuild.googleapis.com',
  'artifactregistry.googleapis.com',
  `--project=${project}`,
]);

gcloud([
  'run',
  'deploy',
  SERVICE,
  '--source=.',
  `--project=${project}`,
  `--region=${REGION}`,
  '--allow-unauthenticated',
  '--max-instances=1',
  '--min-instances=0',
  '--cpu=1',
  '--memory=1Gi',
  '--timeout=15',
  '--concurrency=10',
  '--cpu-throttling',
  '--no-cpu-boost',
  '--quiet',
]);

const url = gcloud(
  [
    'run',
    'services',
    'describe',
    SERVICE,
    `--project=${project}`,
    `--region=${REGION}`,
    '--format=value(status.url)',
  ],
  { capture: true },
);

writeFileSync(
  STATE_PATH,
  `${JSON.stringify({ project, region: REGION, service: SERVICE, url }, null, 2)}\n`,
);

console.log(`\nApp: ${url}`);
console.log(`Docs: ${url}/docs`);
console.log(`API: ${url}/api/health`);
console.log('GitHub Pages stays in-browser unless you wire VITE_API_URL.');
console.log('Killswitch: pnpm cloud:down');

if (process.env.EVALIO_WIRE_PAGES === '1') {
  tryRun('gh', ['variable', 'set', 'EVALIO_API_URL', '--body', url]);
  tryRun('gh', ['workflow', 'run', 'pages.yml', '--ref', 'master']);
  console.log('Wired GitHub Pages to this API. Rebuild is in flight.');
}
