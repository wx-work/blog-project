import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL!;

function createDb() {
    const pool = new Pool({ connectionString, max: 10, connectionTimeoutMillis: 15000 });
    return drizzle({ client: pool });
}

declare global {
    var __db: ReturnType<typeof createDb> | undefined;
}

const db = globalThis.__db ?? createDb();
if (process.env.NODE_ENV !== 'production') globalThis.__db = db;

export default db;