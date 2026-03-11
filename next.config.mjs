import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // 显式把当前项目目录当作 workspace root
    root: __dirname,
  },
  // Next 16 起把 serverComponentsExternalPackages 改成了顶层 serverExternalPackages
  serverExternalPackages: ['pg'],
};

export default nextConfig;