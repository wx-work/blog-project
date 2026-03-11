"use client"
import { authClient } from "@/auth-client";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

const signUpSchema = z.object({
    name: z.string().min(1, "请填写昵称"),
    email: z.string().min(1, "请填写邮箱").email("邮箱格式不正确"),
    password: z.string().min(8, "密码至少 8 位"),
    confirmPassword: z
        .string()
        .min(8, "确认密码至少 8 位")
        .refine(
            (data: string) => data.password === data.confirmPassword,
            { message: "密码不一致" }
        ),
});


export default function SignUpPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        const parsed = signUpSchema.safeParse({ name, email, password, confirmPassword });
        if (!parsed.success) {
            setError(Object.values(parsed.error.flatten().fieldErrors).flat().join("；") || "请检查输入");
            return;
        }
        setLoading(true);
        const result = await authClient.signUp.email({ name, email, password, callbackURL: "/" });
        if (result.error) {
            setLoading(false);
            setError(result.error.message ?? "注册失败");
            return;
        }
        router.push(result.data?.callbackURL ?? "/");
    }
    return (
        <main className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm ring-1 ring-[var(--card-edge)]">
                <h1 className="section-title mb-6 text-xl font-semibold text-[var(--foreground)]">
                    注册
                </h1>
                {error && (
                    <p className="mb-4 text-sm text-red-500 dark:text-red-400">{error}</p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="mb-1 block text-sm text-[var(--muted)]"
                        >
                            昵称
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                        />
                    </div>
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
                    <div className="mb-4">
                        <label
                            htmlFor="confirmPassword"
                            className="mb-1 block text-sm text-[var(--muted)]"
                        >
                            确认密码
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                        />
                        {error && (
                            <p className="text-red-500">{error.confirmPassword}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl border border-[var(--accent)]/50 bg-[var(--accent)] py-2.5 font-medium text-[var(--background)] transition-all hover:bg-[var(--accent-hover)] disabled:opacity-50"
                    >
                        {loading ? "注册中..." : "注册"}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-[var(--muted)]">
                    已有账号？
                    <Link href="/signin" className="text-[var(--accent)] hover:underline">
                        去登录
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