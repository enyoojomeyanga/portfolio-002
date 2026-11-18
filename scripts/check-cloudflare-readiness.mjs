import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const pkg = JSON.parse(read('package.json'));
const checks = [
  ['Next.js App Router', existsSync(join(root, 'src/app/layout.tsx'))],
  ['Health route', existsSync(join(root, 'src/app/api/health/route.ts'))],
  ['Studio fails closed', read('src/app/studio/page.tsx').includes('notFound')],
  ['TypeScript configured', existsSync(join(root, 'tsconfig.json'))],
  ['No accidental committed credentials', !existsSync(join(root, '.env.production')) && !existsSync(join(root, '.env.local'))],
];
let failures = 0;
for (const [name, pass] of checks) {
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}`);
  if (!pass) failures++;
}
console.log(`\nNext.js version requested: ${pkg.dependencies?.next ?? 'missing'}`);
console.log(`vinext configured: ${Boolean(pkg.scripts?.['dev:vinext'])}`);
console.log('Note: this is a source-level preflight; it is NOT a Workers runtime test.');
process.exitCode = failures ? 1 : 0;
