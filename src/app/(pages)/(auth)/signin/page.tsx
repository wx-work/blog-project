"use client"

import { authClient } from "@/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Link from "next/link";

const signInSchema = z.object({
    email: z.string().min(1, "请填写邮箱").email("邮箱格式不正确"),
    password: z.string().min(1, "请填写密码"),
});

export default function SignInPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        // const session = await authClient.getSession();
        // console.log("session12312", session);
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const parsed = signInSchema.safeParse({ email, password });
        if (!parsed.success) {
            setError(Object.values(parsed.error.flatten().fieldErrors).flat().join("；") || "请检查输入");
            return;
        }
        const result = await authClient.signIn.email({ email, password, callbackURL: "/blog" });
        if (result.error) {
            setError(result.error.message ?? "登录失败");
            return;
        }
        router.push("/blog");
    }
    return (
        <main className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm ring-1 ring-[var(--card-edge)]">
                <h1 className="section-title mb-6 text-xl font-semibold text-[var(--foreground)]">
                    登录
                </h1>
                {error && (
                    <p className="mb-4 text-sm text-red-500 dark:text-red-400">{error}</p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm text-[var(--muted)]"
                        >
                            邮箱
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="mb-1 block text-sm text-[var(--muted)]"
                        >
                            密码
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-xl border border-[var(--accent)]/50 bg-[var(--accent)] py-2.5 font-medium text-[var(--background)] transition-all hover:bg-[var(--accent-hover)] disabled:opacity-50"
                    >
                        登录
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-[var(--muted)]">
                    <Link href="/forgot-password" className="text-[var(--accent)] hover:underline">
                        忘记密码
                    </Link>
                    {" · "}
                    没有账号？
                    <Link href="/signup" className="text-[var(--accent)] hover:underline">
                        注册
                    </Link>
                    {" · "}
                    <Link href="/" className="text-[var(--accent)] hover:underline">
                        返回首页
                    </Link>
                </p>
            </div>
        </main>
    );
}