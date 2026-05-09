import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const html = readFileSync('index.html', 'utf8');
const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

if (!jsonLdMatch) {
  throw new Error('Could not find JSON-LD script in index.html');
}

const hash = createHash('sha256').update(jsonLdMatch[1], 'utf8').digest('base64');
const cspToken = `'sha256-${hash}'`;

if (!html.includes(cspToken)) {
  throw new Error(`CSP hash is stale. Expected index.html to contain ${cspToken}`);
}

console.log(`CSP hash is current: ${cspToken}`);

