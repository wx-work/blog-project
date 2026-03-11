import Link from "next/link";

export default function SideBar({ data }: { data: any }) {
    const [categoryList, tagList, params] = data;
    const curTagId = params.tagId ?? null;
    const curCategoryId = params.categoryId ?? null;
    // const pageUrl = (p: number) => (p === 1 ? basePath : `${basePath}?page=${p}
    function curUrl(id: string, type: 'category' | 'tag') {
        const search = new URLSearchParams();
        // 根据当前已选择的分类和标签数据，设置查询参数
        if (params.tagId) search.set("tagId", params.tagId);
        if (params.categoryId) search.set("categoryId", params.categoryId);
        if (params.tagId && type == 'category') search.set("categoryId", id);
        if (params.categoryId && type == 'tag') search.set("tagId", id);
        if (!params.tagId && type == 'category') search.set("categoryId", id);
        if (!params.categoryId && type == 'tag') search.set("tagId", id);

        // 两次点击时一个入口（都是某一个分类或标签），则删除该查询参数
        if (params.tagId && type == 'tag' && params.tagId == id) search.delete("tagId");
        if (params.categoryId && type == 'category' && params.categoryId == id) search.delete("categoryId");
        return `/blog?${search.toString()}`;
    }
    return (
        <div className="space-y-6 border-b border-[var(--border)] pb-6 lg:border-b-0 lg:border-r lg:pr-6 lg:pb-0">

            <h2 className="section-title mb-3 text-sm font-semibold text-[var(--foreground)]">分类</h2>
            <ul>
                {categoryList.map((category: any) => (
                    <Link
                        key={category.id}
                        href={curUrl(category.id, "category")}
                        className={`block rounded-lg px-2 py-1.5 text-sm transition-colors ${curCategoryId == category.id ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]" : "text-[var(--muted)] hover:bg-[var(--accent-soft)]/50 hover:text-[var(--foreground)]"}`}
                    >
                        {category.name}
                    </Link>
                ))}
            </ul>
            <h2 className="section-title mb-3 text-sm font-semibold text-[var(--foreground)]">
                标签
            </h2>
            <ul>
                {tagList.map((tag: any) => (
                    <Link
                        key={tag.id}
                        href={curUrl(tag.id, "tag")}
                        className={`block rounded-lg px-2 py-1.5 text-sm transition-colors ${curTagId == tag.id ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]" : "text-[var(--muted)] hover:bg-[var(--accent-soft)]/50 hover:text-[var(--foreground)]"}`}
                    >
                        {tag.name}
                    </Link>
                ))}
            </ul>
        </div>
    );
}