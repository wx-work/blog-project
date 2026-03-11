import Link from "next/link";
import db from "@/database/client";
import { categories, posts, tags } from "@/database/schema";
import { postApi } from "@/api/post";
import Pagination from "@/app/_components/pagination";
import NotFound from "@/app/not-found";
import DeleteBtn from "@/app/_components/deletebtn";
import SideBar from "@/app/_components/sideBar";
import { asc } from "drizzle-orm";
import { Breadcrumb } from "antd";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export default async function Blog({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; categoryId?: string; tagId?: string }>;
}) {
    // const { page: pageStr } = await searchParams;




    const params = await searchParams;
    const page = Math.max(1, Number(params.page) || 1);

    const all = await postApi.paginate({
        page,
        limit: 5,
        category: params.categoryId,
        tag: params.tagId,
    });
    const totalPages = all.totalPages;
    const currentPage = page == 1 ? 1 : page;
    const curData =
        page !== 1
            ? await postApi.paginate({
                  page: page,
                  limit: 5,
                  category: params.categoryId,
                  tag: params.tagId,
              })
            : all;

    const categoryList = await db
        .select()
        .from(categories)
        .orderBy(asc(categories.name));
    const tagList = await db.select().from(tags).orderBy(asc(tags.name));

    return (
        <div className="container mx-auto min-w-0 max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-56 lg:self-start">
                    <SideBar data={[categoryList, tagList, params]} />
                </aside>
                <main className="min-w-0 flex-1">

                    <nav className="breadcrumb-nav mb-4 text-sm text-[var(--muted)]" aria-label="面包屑">
                        <Breadcrumb
                            items={[
                                {
                                    title: <Link href="/">首页</Link>,
                                },
                                {
                                    title: <Link href="/blog">列表</Link>,
                                },
                            ]}
                        />
                    </nav>

                    <Link
                        href="/blog/create"
                        className="my-6 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
                    >
                        创建文章
                    </Link>
                    <ul className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)]">
                        {curData.items.map((post) => (
                            <li
                                key={post.id}
                                className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-4 transition-colors duration-200 hover:bg-[var(--accent-soft)]/60 sm:px-5 sm:py-4"
                            >
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="group min-w-0 flex-1"
                                >
                                    <h2 className="mb-1 font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                                        {post.title}
                                    </h2>
                                    {post.summary && (
                                        <p className="mb-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
                                            {post.summary}
                                        </p>
                                    )}
                                    <time
                                        dateTime={post.updatedAt}
                                        className="text-xs text-[var(--muted)]"
                                    >
                                        {new Date(post.updatedAt).toLocaleDateString("zh-CN")}
                                    </time>
                                </Link>
                                <span className="flex shrink-0 items-center gap-2">
                                    <Link
                                        href={`/blog/edit/${post.slug}`}
                                        className="text-sm font-medium text-[var(--muted)] hover:text-[var(--accent)] hover:underline"
                                    >
                                        编辑
                                    </Link>
                                    <DeleteBtn id={post.id} />
                                </span>
                            </li>
                        ))}
                    </ul>
                    <Pagination
                        basePath="/blog"
                        params={params}
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                </main>
            </div>

        </div>
    );
}
