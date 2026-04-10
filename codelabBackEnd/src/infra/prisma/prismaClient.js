import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const parseInteger = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: parseInteger(process.env.PG_POOL_MAX, 20),
  idleTimeoutMillis: parseInteger(process.env.PG_IDLE_TIMEOUT_MS, 30000),
  connectionTimeoutMillis: parseInteger(process.env.PG_CONNECTION_TIMEOUT_MS, 10000),
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const PRISMA_TRANSACTION_OPTIONS = {
  maxWait: parseInteger(process.env.PRISMA_TRANSACTION_MAX_WAIT_MS, 10000),
  timeout: parseInteger(process.env.PRISMA_TRANSACTION_TIMEOUT_MS, 20000),
};

export default prisma;

