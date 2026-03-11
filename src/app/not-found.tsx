import Link from "next/link";

/** 9.1 自定义 404 页 */
export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">404</h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400">页面不存在</p>
            <Link
                href="/"
                className="mt-8 rounded-lg bg-gray-900 px-6 py-3 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
                返回首页
            </Link>
        </div>
    );
}
