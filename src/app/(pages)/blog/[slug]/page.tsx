import db from "@/database/client";
import { posts } from "@/database/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { postApi } from "@/api/post";
import NotFound from "@/app/not-found";
import type { Metadata } from "next";
import DeleteBtn from "@/app/_components/deletebtn";
import { Breadcrumb } from "antd";
import { MdxContent } from "@/app/_components/mdx-content";
import { TocTree } from "@/app/_components/toc-tree";
import { tocFromMarkdown } from "@/app/_components/toc-from-markdown";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";



export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {

    return {
        title: "详情页 | 我的博客",
        description: "详情页描述",
        keywords: "详情页关键词",
    };
}

export default async function BlogPosts({ params }: { params: Promise<{ slug: string }> }) {

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        redirect("/signin");  // 或 return 一个「请先登录」的 UI
    }
    const { slug } = await params;
    const post = await postApi.detail(slug);
    if (!post) {
        return <NotFound />;
    }
    const tocItems = tocFromMarkdown(post.body);
    return (
        <>
            {post ? (
                <main className="container mx-auto min-w-0 max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
                    <div className="flex flex-col lg:flex-row lg:gap-8">


                        <article className="min-w-0 flex-1 max-w-3xl">
                            <nav className="breadcrumb-nav mb-6 text-sm text-[var(--muted)]" aria-label="面包屑">
                                <Breadcrumb
                                    items={[
                                        {
                                            title: <Link href="/">首页</Link>,
                                        },
                                        {
                                            title: <Link href="/blog">列表</Link>,
                                        },
                                        {
                                            title: <Link href={`/blog/${post.slug}`}>{post.title}</Link>,
                                        },
                                    ]}
                                />
                            </nav>
                            <header className="mb-6 sm:mb-8">
                                <h1 className="mb-2 break-words text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
                                    {post.title}
                                </h1>
                                {post.summary && (
                                    <p className="mb-4 text-lg leading-relaxed text-[var(--muted)]">
                                        {post.summary}
                                    </p>
                                )}
                                <time dateTime={post.updatedAt} className="text-sm text-[var(--muted)]">
                                    {new Date(post.updatedAt).toLocaleDateString("zh-CN")}
                                </time>
                                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--border)] pt-4">
                                    <span className="flex items-center gap-2">
                                        <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">分类</span>
                                        {post.category?.length ? (
                                            <Link
                                                href={`/blog?categoryId=${post.category[0].id}`}
                                                className="rounded-md border border-[var(--border)] bg-[var(--accent-soft)] px-2.5 py-1 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]/80 hover:underline"
                                            >
                                                {post.category[0].name}
                                            </Link>
                                        ) : (
                                            <span className="text-sm text-[var(--muted)]">—</span>
                                        )}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">标签</span>
                                        {post.tags?.length ? (
                                            <span className="flex flex-wrap gap-1.5">
                                                {post.tags.map((tag) => (
                                                    <Link
                                                        key={tag.id}
                                                        href={`/blog?tagId=${tag.id}`}
                                                        className="rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 py-0.5 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                                                    >
                                                        {tag.name}
                                                    </Link>
                                                ))}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-[var(--muted)]">—</span>
                                        )}
                                    </span>
                                </div>
                            </header>

                            <div className="prose dark:prose-invert max-w-none break-words [&_.hljs]:rounded-lg prose-headings:scroll-mt-20 mb-3">
                                <MdxContent source={post.body} />
                            </div>
                            <div>
                                <Link
                                    href={`/blog/edit/${post.slug}`}
                                    className="text-sm font-medium text-[var(--accent)] hover:underline"
                                >
                                    编辑
                                </Link>
                                <Link
                                    href="/blog"
                                    className="mx-6 text-sm font-medium text-[var(--accent)] hover:underline"
                                >
                                    返回列表
                                </Link>
                                <DeleteBtn id={post.id} />
                            </div>

                        </article>
                        {tocItems.length > 0 && (
                            <aside className="lg:sticky lg:top-24 lg:w-56 lg:shrink-0 lg:self-start">
                                <TocTree items={tocItems} />
                            </aside>
                        )}

                    </div>
                </main>
            ) : (
                <NotFound />
            )}
        </>
    );
}