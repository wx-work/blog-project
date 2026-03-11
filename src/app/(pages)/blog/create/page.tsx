"use client";

import { useState, useEffect } from "react";
import { Post, postApi } from "@/api/post";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Select, Breadcrumb } from "antd";
import Link from "next/link";
import { MdEditor } from "@/app/_components/md-editor";


function getBaseUrl(): string {
    if (typeof window !== "undefined") return "";
    return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

async function apiFetch<T>(
    path: string,
    init?: RequestInit
): Promise<{ data?: T; error?: { code: number; message: string }; status: number }> {
    const base = getBaseUrl();
    const res = await fetch(`${base}${path}`, {
        ...init,
        headers: { "Content-Type": "application/json", ...init?.headers },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { error: body as { code: number; message: string }, status: res.status };
    return { data: body as T, status: res.status };
}

const postSchema = z.object({
    title: z.string().min(1, "标题不能为空"),
    slug: z
        .string()
        .min(1, "Slug 不能为空")
        .regex(/^[a-z0-9-]+$/, "Slug 仅允许小写字母、数字、连字符"),
    summary: z.string().max(10).optional(),
    body: z.string().min(1, "正文不能为空"),
});


export default function BlogCreatePage() {

    const router = useRouter();
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Post[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [categoryId, setCategoryId] = useState<string>('');
    const [tagIds, setTagIds] = useState<string[]>([]);
    const [body, setBody] = useState<string>('');

    // 获取下拉及标签多选数据
    const fetchCategories = async () => {
        const { data: categoriesData } = await apiFetch<Post>(`/api/categories`);
        setCategories(categoriesData);
    };
    const fetchTags = async () => {
        const { data: tagsData } = await apiFetch<Tag[]>(`/api/tags`);
        setTags(tagsData);
    };
    useEffect(() => {
        fetchCategories();
        fetchTags();
    }, []);
    // 处理数据请求
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string;
        const summary = formData.get("summary") as string;
        // const body = formData.get("body") as string;
        const parsed = postSchema.safeParse({ title, slug, summary, body });
        if (!parsed.success) {
            console.log('666999', parsed.error.flatten().fieldErrors);
            setError(parsed.error.flatten().fieldErrors);
            return;
        }
        setLoading(true);

        try {
            // throw new Error('创建失败');
            await postApi.create({
                title,
                slug,
                summary,
                body,
                categoryId: categoryId,
                tagIds: tagIds,
            });
            router.push(`/blog/${slug}`);

        }
        catch (error) {
            setError(error instanceof Error ? error.message : "创建失败");
        }
        finally {
            setLoading(false);
        }
    }
    const fieldClass = "w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors";
    const labelClass = "block text-sm font-medium text-[var(--foreground)] mb-1";
    const errorClass = "mt-1 text-sm text-red-500";

    return (
        <main className="container mx-auto min-w-0 max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
            <nav className="breadcrumb-nav mb-6 text-sm text-[var(--muted)]" aria-label="面包屑">
                <Breadcrumb
                    items={[
                        { title: <Link href="/">首页</Link> },
                        { title: <Link href="/blog">列表</Link> },
                        { title: <Link href="/blog/create">创建</Link> },
                    ]}
                />
            </nav>
            <div className="max-w-3xl">
                <form onSubmit={handleSubmit} className="form-page space-y-5">
                    {error && typeof error === "string" && <p className="text-sm text-red-500">{error}</p>}
                    <div>
                        <label htmlFor="title" className={labelClass}>
                            标题
                        </label>
                        {error?.title && <p className={errorClass}>{error.title}</p>}
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            className={fieldClass}
                        />
                    </div>
                    <div>
                        <label htmlFor="slug" className={labelClass}>
                            别名
                        </label>
                        {error?.slug && <p className={errorClass}>{error.slug}</p>}
                        <input
                            type="text"
                            name="slug"
                            id="slug"
                            required
                            className={fieldClass}
                            placeholder=""
                        />
                    </div>
                    <div>
                        <label htmlFor="summary" className={labelClass}>
                            摘要
                        </label>
                        {error?.summary && <p className={errorClass}>{error.summary}</p>}
                        <input
                            type="text"
                            name="summary"
                            id="summary"
                            className={fieldClass}
                            placeholder=""
                        />
                    </div>
                    <div>
                        <label htmlFor="categoryId" className={labelClass}>
                            分类
                        </label>
                        <Select
                            name="categoryId"
                            id="categoryId"
                            className="w-full"
                            showSearch={{
                                filterOption: (input, option) =>
                                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
                            }}
                            placeholder="请选择分类"
                            onChange={(value) => setCategoryId(value)}
                            options={categories.map((category) => ({
                                value: category.id,
                                label: category.name,
                            }))}
                        />
                    </div>
                    <div>
                        <label htmlFor="tagIds" className={labelClass}>标签</label>
                        <Select
                            mode="multiple"
                            name="tagIds"
                            id="tagIds"
                            className="w-full"
                            placeholder="请选择标签，可多选"
                            onChange={(value) => setTagIds(value)}
                            options={tags.map((tag) => ({
                                value: tag.id,
                                label: tag.name,
                            }))}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>
                            正文
                        </label>
                        {error?.body && <p className={errorClass}>{error.body}</p>}
                        <MdEditor
                            value={body}
                            onChange={(v) => setBody(v ?? "")}
                            height={320}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-[var(--accent)] px-4 py-2 font-medium text-[var(--background)] transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? "创建中…" : "创建"}
                    </button>
                </form>
            </div>
        </main>
    );
}