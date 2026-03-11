import Link from "next/link";

export type TocItem = {
  level: number;
  text: string;
  id: string;
};

type Props = { items: TocItem[] };

/**
 * 文章详情目录树：根据标题层级渲染为可点击锚点链接，与正文标题 id 对应
 */
export function TocTree({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="文章目录"
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 ring-1 ring-[var(--card-edge)]"
    >
      <p className="section-title mb-3 text-sm font-semibold text-[var(--foreground)]">
        目录
      </p>
      <ul className="space-y-1.5 border-l-2 border-[var(--accent)]/30 pl-4">
        {items.map((item, i) => (
          <li
            key={i}
            style={{ paddingLeft: (item.level - 1) * 12 }}
            className="list-none"
          >
            <Link
              href={`#${item.id}`}
              className="text-sm text-[var(--muted)] hover:text-[var(--accent)] hover:underline"
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
