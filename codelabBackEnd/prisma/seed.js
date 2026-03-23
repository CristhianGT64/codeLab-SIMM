import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SEED_FILES = {
  base: resolve(__dirname, 'seed_required_tables.sql'),
  business: resolve(__dirname, 'seed_business_tables.sql'),
};

const mode = (process.argv[2] || 'all').toLowerCase();

function runSeedFile(filePath, label) {
  console.log(`\n[seed] Ejecutando ${label}: ${filePath}`);
  execSync(`npx prisma db execute --file "${filePath}"`, { stdio: 'inherit' });
  console.log(`[seed] ${label} completado`);
}

function main() {
  if (mode === 'base') {
    runSeedFile(SEED_FILES.base, 'seed base');
    return;
  }

  if (mode === 'business') {
    runSeedFile(SEED_FILES.business, 'seed negocio');
    return;
  }

  if (mode === 'all') {
    runSeedFile(SEED_FILES.base, 'seed base');
    runSeedFile(SEED_FILES.business, 'seed negocio');
    return;
  }

  console.error('[seed] Modo invalido. Usa: base | business | all');
  process.exitCode = 1;
}

main();
