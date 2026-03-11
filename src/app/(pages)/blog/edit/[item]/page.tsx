import { postApi } from "@/api/post";
import { notFound } from "next/navigation";
import EditForm from "@/app/_components/editform";
import { Breadcrumb } from "antd";
import Link from "next/link";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function BlogEditPage({ params }: { params: Promise<{ item: string }> }) {

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        redirect("/signin");  // 或 return 一个「请先登录」的 UI
    }

    const { item } = await params;
    const result = await postApi.detail(item);
    if (!result) {
        return notFound();
    }
    const post = result;
    return (
        <div className="container mx-auto min-w-0 max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
            <nav className="breadcrumb-nav mb-6 text-sm text-[var(--muted)]" aria-label="面包屑">
                <Breadcrumb
                    items={[
                        { title: <Link href="/">首页</Link> },
                        { title: <Link href="/blog">列表</Link> },
                        { title: <Link href={`/blog/edit/${item}`}>编辑</Link> },
                    ]}
                />
            </nav>
            <EditForm post={post} />
        </div>
    );
}