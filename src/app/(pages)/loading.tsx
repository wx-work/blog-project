/**
 * 9.3 加载态：(pages) 下路由切换或首屏加载时展示，无布局抖动
 */
export default function Loading() {
  return (
    <div className="container mx-auto min-w-0 px-4 py-12">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-full max-w-xl rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-full max-w-lg rounded bg-gray-200 dark:bg-gray-700" />
        <div className="grid gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
