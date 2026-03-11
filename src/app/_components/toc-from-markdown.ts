import GithubSlugger from "github-slugger";

export type TocItem = {
  level: number;
  text: string;
  id: string;
};

const headingRe = /^(#{1,6})\s+(.+)$/gm;

/**
 * 从 Markdown 正文中解析标题，生成目录项；id 与 rehype-slug 一致（github-slugger）
 */
export function tocFromMarkdown(source: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let m: RegExpExecArray | null;
  headingRe.lastIndex = 0;
  while ((m = headingRe.exec(source)) !== null) {
    const level = m[1].length;
    const text = m[2].trim();

    const id = slugger.slug(text);
    items.push({ level, text, id });
  }
  return items;
}
