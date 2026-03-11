import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username, emailOTP } from "better-auth/plugins";
import db from "@/database/client";
import * as authSchema from "@/database/auth-schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: authSchema.user,
            session: authSchema.session,
            account: authSchema.account,
            verification: authSchema.verification,
        },
    }),
    basePath: "/api/auth",
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        username({
            // 允许用用户名或邮箱登录
        }),
        emailOTP({
            // 用于邮箱验证码（登录 / 验证邮箱 / 忘记密码）
            async sendVerificationOTP({ email, otp, type }) {
                // 这里仅做控制台输出，实际项目中应改为真正发邮件
                console.log("[emailOTP] sendVerificationOTP", { email, otp, type });
            },
        }),
    ],
});
