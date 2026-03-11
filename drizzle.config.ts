import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: ["./src/database/schema.ts", "./src/database/auth-schema.ts"],
    // schema: './src/database/schema.ts',   // 你的 schema 文件路径
    out: './src/database/migrations',     // 迁移文件输出目录
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});