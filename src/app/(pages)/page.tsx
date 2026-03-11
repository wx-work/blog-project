import Image from "next/image";
import db from "@/database/client";
import { posts } from "@/database/schema";
import { authClient } from "@/auth-client";
import Link from "next/link";
import { Timeline } from "antd";

// import { baseURL } from "@/config";

const baseURL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type PostItem = {
  id: string;
  title: string;
  summary: string | null;
  slug: string | null;
  updatedAt: string;
};

async function getLatestPosts(): Promise<PostItem[]> {
  const res = await fetch(`${baseURL}/api/posts?page=1&limit=6`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

export default async function Home() {

  const posts = await getLatestPosts();

  return (
    <main className="container mx-auto min-w-0 max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      <section className="mb-16">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
          WELCOME
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
          生活、技术、工作
        </p>
      </section>
      <h2 className="section-title mb-6 text-xl font-semibold text-[var(--foreground)]">
        最新文章
      </h2>
      {posts.length === 0 ? (
        <p className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-center text-[var(--muted)]">
          暂无文章。
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post, i) => (
            <li
              key={post.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms`, opacity: 0 }}
            >
              <Link
                href={`/blog/${post.slug ?? post.id}`}
                className="group block rounded-xl border border-[var(--border)] bg-transparent p-4 transition-colors duration-200 hover:bg-[var(--accent-soft)]/60 sm:p-5"
              >
                <h3 className="mb-2 line-clamp-2 font-semibold text-[var(--foreground)] transition-colors duration-200 group-hover:text-[var(--accent)]">
                  {post.title}
                </h3>
                {post.summary && (
                  <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
                    {post.summary}
                  </p>
                )}
                <time dateTime={post.updatedAt} className="text-xs text-[var(--muted)]">
                  {new Date(post.updatedAt).toLocaleDateString("zh-CN")}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {posts.length > 0 && (
        <div className="mt-8 flex justify-start">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--accent)]/50 bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--accent)] transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--background)]"
          >
            查看全部
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}
      <div className="mt-6">
        <Timeline
          items={[
            {
              content: 'Create a services site 2015-09-01',
            },
            {
              content: 'Solve initial network problems 2015-09-01',
            },
            {
              content: 'Technical testing 2015-09-01',
            },
            {
              content: 'Network problems being solved 2015-09-01',
            },
          ]}
        />
      </div>
    </main>
  );
}
