import Link from "next/link";

export default function Pagination({ basePath, params, currentPage, totalPages }: { basePath: string, params: any, currentPage: number, totalPages: number }) {

    if (totalPages <= 1) return null;
    const prePage = currentPage == 1 ? null : currentPage - 1;
    const nextPage = currentPage == totalPages ? null : currentPage + 1;
    // const pageUrl = (p: number) => (p === 1 ? basePath : `${basePath}?page=${p}`);
    function curUrl(p: number) {
        const search = new URLSearchParams();
        search.set("page", String(p));
        if (params.tagId) search.set("tagId", params.tagId);
        if (params.categoryId) search.set("categoryId", params.categoryId);
        return `/blog?${search.toString()}`;
    }

    return (
        <nav className="mt-6 flex items-center gap-4" aria-label="分页">

            {prePage ? (
                <Link
                    href={curUrl(prePage)}
                    className="text-sm font-medium text-[var(--accent)] hover:underline"
                >
                    上一页
                </Link>
            ) : (
                <p className="cursor-not-allowed text-sm text-[var(--muted)]">上一页</p>
            )}
            <span className="text-sm text-[var(--muted)]">
                第 {currentPage} / {totalPages} 页
            </span>
            {nextPage ? (
                <Link
                    href={curUrl(nextPage)}
                    className="text-sm font-medium text-[var(--accent)] hover:underline"
                >
                    下一页
                </Link>
            ) : (
                <p className="cursor-not-allowed text-sm text-[var(--muted)]">下一页</p>
            )}
        </nav>
    );
}
