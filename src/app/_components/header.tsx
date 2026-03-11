"use client";

/**
 * 7.6 Header：根据登录态显示「登录/注册」或用户菜单（含登出）；博客/创建文章按 pathname 高亮
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/auth-client";
import { useTheme } from "next-themes";
import { motion } from "motion/react";

const navLink =
  "relative shrink-0 text-sm transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--accent)] after:transition-all after:duration-200 hover:after:w-full";
const navLinkActive =
  "font-semibold text-[var(--foreground)] after:w-full";
const navLinkInactive =
  "text-[var(--muted)] hover:text-[var(--foreground)]";

export function Header() {
  const pathname = usePathname() ?? "";
  const { data: session, isPending } = authClient.useSession();
  const { resolvedTheme, setTheme } = useTheme();

  const isHome = pathname === "/";
  const isBlog = pathname === "/blog" || (pathname.startsWith("/blog/") && !pathname.startsWith("/blog/create"));
  const isCreate = pathname === "/blog/create";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm">
      <nav className="container mx-auto flex min-h-14 max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6 sm:py-00">
        <Link
          href="/"
          className={`${navLink} ${isHome ? navLinkActive : navLinkInactive}`}
        >
          首页
        </Link>
        <Link
          href="/blog"
          className={`${navLink} ${isBlog ? navLinkActive : navLinkInactive}`}
        >
          博客
        </Link>
        <Link
          href="/blog/create"
          className={`${navLink} ${isCreate ? navLinkActive : navLinkInactive}`}
        >
          创建文章
        </Link>
        <span className="ml-auto flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.88 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="min-h-[2.25rem] min-w-[2.25rem] rounded-lg border border-transparent px-2 text-[var(--muted)] hover:border-[var(--border)] hover:text-[var(--foreground)] hover:bg-[var(--accent-soft)] text-sm transition-all duration-200 active:scale-95"
            title={resolvedTheme === "dark" ? "切换为浅色" : "切换为深色"}
          >
            {resolvedTheme === "dark" ? "浅色" : "深色"}
          </motion.button>
          {isPending ? (
            <span className="text-gray-400 dark:text-gray-500 text-sm">
              加载中…
            </span>
          ) : session?.user ? (
            <>
              <span className="rounded-md bg-[var(--card)] px-2 py-1 text-[var(--muted)] text-sm ring-1 ring-[var(--border)]">
                {session.user.name ?? session.user.email ?? session.user.id}
              </span>
              <button
                type="button"
                onClick={() => authClient.signOut()}
                className="min-h-[2.25rem] rounded-lg border border-transparent px-2 text-[var(--muted)] hover:border-[var(--border)] hover:text-[var(--foreground)] hover:bg-[var(--accent-soft)] text-sm transition-all duration-200 active:scale-95"
              >
                登出
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-lg bg-[var(--accent)]/12 px-3 py-1.5 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--background)] text-sm font-medium transition-all duration-200 ring-1 ring-[var(--accent)]/40"
              >
                登录
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-[var(--accent)]/12 px-3 py-1.5 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--background)] text-sm font-medium transition-all duration-200 ring-1 ring-[var(--accent)]/40"
              >
                注册
              </Link>
            </>
          )}
        </span>
      </nav>
    </header>
  );
}
