"use client";

/**
 * 9.2 错误边界：子路由抛错时展示友好错误信息与恢复入口
 */
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-12">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        出错了
      </h2>
      <p className="mt-2 max-w-md text-center text-gray-600 dark:text-gray-400">
        {error.message || "请稍后重试或返回首页。"}
      </p>
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          重试
        </button>
        <a
          href="/"
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          返回首页
        </a>
      </div>
    </div>
  );
}
