import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const remarkPlugins = [remarkGfm];
const rehypePlugins = [rehypeSlug, rehypeHighlight];

type Props = { source: string };

/**
 * 正文渲染：用 react-markdown 只解析 Markdown（GFM + 标题 id + 代码高亮），
 * 不解析 JSX/表达式，避免用户输入中的 {、< 触发 next-mdx-remote 的 acorn 错误。
 */
export function MdxContent({ source }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
    >
      {source}
    </ReactMarkdown>
  );
}
