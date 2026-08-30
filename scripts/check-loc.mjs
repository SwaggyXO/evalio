import { readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const LIMIT = 250;
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.css']);
const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  'playwright-report',
  'test-results',
  '.git',
]);

function countLoc(source) {
  let count = 0;
  let inBlock = false;
  for (const raw of source.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (inBlock) {
      if (line.includes('*/')) inBlock = false;
      continue;
    }
    if (line.startsWith('/*')) {
      if (!line.includes('*/')) inBlock = true;
      continue;
    }
    if (line.startsWith('//') || line.startsWith('/*')) continue;
    count += 1;
  }
  return count;
}

async function walk(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(path, files);
      continue;
    }
    if (EXTENSIONS.has(extname(entry.name))) files.push(path);
  }
  return files;
}

const files = await walk(ROOT);
const violations = [];
for (const file of files) {
  const loc = countLoc(await readFile(file, 'utf8'));
  if (loc > LIMIT) violations.push({ file, loc });
}

if (violations.length > 0) {
  console.error(`Files over ${LIMIT} LOC:`);
  for (const { file, loc } of violations) {
    console.error(`  ${loc}\t${file}`);
  }
  process.exit(1);
}

console.log(`OK: ${files.length} files, all <= ${LIMIT} LOC`);
