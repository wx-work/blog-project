"use client";

/**
 * 10.2 Markdown 编辑器：@uiw/react-md-editor，编辑时可预览
 */
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

const MDEditor = dynamic(() => import("@uiw/react-md-editor").then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="h-[300px] animate-pulse rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />,
});

type Props = {
  value: string;
  onChange: (value?: string) => void;
  height?: number;
};

export function MdEditor({ value, onChange, height = 300 }: Props) {
  const { resolvedTheme } = useTheme();
  const colorMode = resolvedTheme === "dark" ? "dark" : "light";
  return (
    <div data-color-mode={colorMode}>
      <MDEditor
        value={value}
        onChange={onChange}
        height={height}
        preview="live"
        visibleDragbar={false}
      />
    </div>
  );
}
