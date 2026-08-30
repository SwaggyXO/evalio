import { unlinkSync } from 'node:fs';
import {
  gcloud,
  loadState,
  projectId,
  REGION,
  SERVICE,
  STATE_PATH,
  tryRun,
} from './cloud-lib.mjs';

const state = loadState();
const project = state?.project ?? projectId();
const region = state?.region ?? REGION;
const service = state?.service ?? SERVICE;

console.log(`Deleting ${service} from ${project} / ${region}`);

gcloud([
  'run',
  'services',
  'delete',
  service,
  `--project=${project}`,
  `--region=${region}`,
  '--quiet',
]);

const image = `${region}-docker.pkg.dev/${project}/cloud-run-source-deploy/${service}`;
tryRun('gcloud', [
  'artifacts',
  'docker',
  'images',
  'delete',
  image,
  '--delete-tags',
  '--quiet',
  `--project=${project}`,
]);

tryRun('gh', ['variable', 'delete', 'EVALIO_API_URL', '--yes']);
tryRun('gh', ['workflow', 'run', 'pages.yml', '--ref', 'master']);

try {
  unlinkSync(STATE_PATH);
} catch {
  // already gone
}

console.log('Cloud Run service is gone. Pages falls back to in-browser.');
console.log('Hackathon Artifact Registry repos were left untouched.');
