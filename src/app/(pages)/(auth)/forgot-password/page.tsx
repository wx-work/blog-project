"use client";
import { useState } from "react";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";
import { z } from "zod";

const emailSchema = z.object({
    email: z.string().email("请输入正确的邮箱地址"),
});
const resetSchema = z.object({
    otp: z.string().min(1, "请输入验证码"),
    password: z.string().min(8, "密码至少8位"),
});

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<"email" | "reset">("email");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>("");

    async function handleSendOtp(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const parsed = emailSchema.safeParse({ email });
        if (!parsed.success) {
            setError(Object.values(parsed.error.flatten().fieldErrors).flat().join("；") || "请检查输入");
            setLoading(false);
            return;
        }
        const result = await authClient.emailOtp.requestPasswordReset({ email });
        if (result.error) {
            setError(result.error.message ?? "发送失败");
            setLoading(false);

            return;
        }
        setLoading(false);
        setEmail(email);
        setStep("reset");
    }

    async function handleReset(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const otp = formData.get("otp") as string;
        const password = formData.get("password") as string;
        const parsed = resetSchema.safeParse({ otp, password });
        if (!parsed.success) {
            setError(Object.values(parsed.error.flatten().fieldErrors).flat().join("；") || "请检查输入");
            setLoading(false);
            return;
        }
        if (!email) {
            setError("邮箱信息缺失，请重新发送验证码。");
            setLoading(false);
            return;
        }
        const result = await authClient.emailOtp.resetPassword({ email, otp, password });
        if (result.error) {
            setError(result.error.message ?? "重置失败");
            setLoading(false);
            return;
        }
        router.push("/signin");
    }

    return (
        <main className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm ring-1 ring-[var(--card-edge)]">
                <h1 className="section-title mb-6 text-xl font-semibold text-[var(--foreground)]">
                    忘记密码
                </h1>
                {error && (
                    <p className="mb-4 text-sm text-red-500 dark:text-red-400">{error}</p>
                )}
                {step === "email" ? (
                    <form onSubmit={handleSendOtp}>
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
                        <button
                            type="submit"
                            className="w-full rounded-xl border border-[var(--accent)]/50 bg-[var(--accent)] py-2.5 font-medium text-[var(--background)] transition-all hover:bg-[var(--accent-hover)] disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "发送中..." : "发送验证码"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleReset}>
                        <p className="mb-4 text-sm text-[var(--muted)]">
                            验证码已发送至 {email}，请查收后填写下方信息。
                        </p>
                        <div className="mb-4">
                            <label
                                htmlFor="otp"
                                className="mb-1 block text-sm text-[var(--muted)]"
                            >
                                验证码
                            </label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="password"
                                className="mb-1 block text-sm text-[var(--muted)]"
                            >
                                新密码
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
                            {loading ? "重置中..." : "重置密码"}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}