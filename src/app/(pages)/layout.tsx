import Link from "next/link";
import { Header } from "@/app/_components/header";

/** (pages) 根布局：仅接收 children，符合 Next.js LayoutProps<"/"> */
export default function Layout(props: { children: React.ReactNode }) {
    const { children } = props;
    return (
        <div className="flex min-h-screen flex-col">
            {/* <header className="flex justify-center items-center space-x-4">
                <Link href="/" className="text-blue-500">首页</Link>
                <Link href="/blog" className="text-blue-500">博客</Link>
                <Link href="/signin" className="text-blue-500">登录</Link>
                <Link href="/signup" className="text-blue-500">注册</Link>


            </header> */}
            <Header />
            <main className="min-w-0 flex-1">{children}</main>
            <footer className="mt-auto border-t border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm">
                <div className="container mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
                    <div className="h-px w-12 bg-[var(--accent)] rounded-full mx-auto mb-4" aria-hidden />
                    <p className="text-center text-sm text-[var(--muted)] opacity-90">
                        Developed by WX  © {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    );
}
