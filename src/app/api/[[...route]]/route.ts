import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import { z } from "zod";
import db from "@/database/client";
import { categories, postTags, posts, tags } from "@/database/schema";
import { and, asc, count, desc, eq, inArray, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { headers } from "next/headers";



const app = new Hono().basePath("/api");
app.use("*", cors());


const authHandler = auth.handler();
app.all("/auth", async (c) => authHandler(c.req.raw));
app.all("/auth/*", async (c) => authHandler(c.req.raw));

// app.use(auth());
const uuidSchema = z.string().uuid();
const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
app.get("/", (c) => c.json({ ok: true }));
app.get("/hello", (c) => {
    return c.json({ message: "Hello Next.js!123" });
});
const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    category: z.string().optional(),
    tag: z.string().optional(),
});
app.get("/posts", async (c) => {
    const parsed = paginationSchema.safeParse({
        page: c.req.query("page"),
        limit: c.req.query("limit"),
        category: c.req.query("category"),
        tag: c.req.query("tag"),
    });
    if (!parsed.success) {
        return c.json(
            {
                code: 400,
                message: "Invalid query",
                details: parsed.error.flatten().fieldErrors,
            },
            400
        );
    }
    const { page, limit, category, tag } = parsed.data;
    const offset = (page - 1) * limit;

    const conditions = [];
    if (category) {
        const isUuid = UUID_REGEX.test(category);
        const [cat] = await db
            .select({ id: categories.id })
            .from(categories)
            .where(isUuid ? eq(categories.id, category) : eq(categories.slug, category))
            .limit(1);
        if (cat) conditions.push(eq(posts.categoryId, cat.id));
    }
    if (tag) {
        const isUuid = UUID_REGEX.test(tag);
        const [t] = await db
            .select({ id: tags.id })
            .from(tags)
            .where(isUuid ? eq(tags.id, tag) : eq(tags.slug, tag))
            .limit(1);
        if (t) {
            const postIds = await db
                .select({ postId: postTags.postId })
                .from(postTags)
                .where(eq(postTags.tagId, t.id));
            const ids = postIds.map((r) => r.postId);
            conditions.push(ids.length > 0 ? inArray(posts.id, ids) : sql`1 = 0`);
        }
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalRow] = await db
        .select({ count: count() })
        .from(posts)
        .where(whereClause);
    const total = Number(totalRow?.count ?? 0);
    const items = await db
        .select()
        .from(posts)
        .where(whereClause)
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset);

    return c.json({
        items,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit) || 1,
    });
});

// 文章详情接口
app.get("/posts/:item", async (c) => {

    // 接口认证保护
    // const session = await auth.api.getSession({ headers: c.req.raw.headers });
    // console.log('session12312312312', session, c.req.raw.headers)
    // if (!session?.user) return c.json({ code: 401, message: "Unauthorized" }, 401);

    const item = c.req.param("item");
    const parsed = uuidSchema.safeParse(item);
    const result = await db
        .select()
        .from(posts)
        .where(parsed.success ? eq(posts.id, item) : eq(posts.slug, item));
    if (!result[0]) return c.json({ error: "无信息", code: 404 });
    const category = result[0].categoryId
        ? await db
              .select()
              .from(categories)
              .where(eq(categories.id, result[0].categoryId))
        : null;
    const tarIds = await db
        .select()
        .from(postTags)
        .where(eq(postTags.postId, result[0].id));
    const tagList = await db
        .select()
        .from(tags)
        .where(inArray(tags.id, tarIds.map((r) => r.tagId)));

    return c.json(
        { ...result[0], category: category ?? null, tags: tagList ?? [] },
        200
    );
});

const postSchema = z.object({
    title: z.string().min(1, "标题不能为空"),
    body: z.string().min(1, "内容不能为空"),
    slug: z.string().min(1, "slug不能为空"),
    summary: z.string().optional(),
    categoryId: z.string().optional(),
    thumb: z.string().optional(),
    keywords: z.string().optional(),
    description: z.string().optional(),
});

// 创建文章接口
app.post("/posts", async (c) => {
    const body = await c.req.json();

    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user)
        return c.json({ code: 401, message: "Unauthorized" }, 401);
    const parsed = postSchema.safeParse(body);
    if (!parsed.success)
        return c.json(
            {
                error: "验证失败",
                code: 400,
                details: parsed.error.flatten().fieldErrors,
            },
            400
        );
    console.log("parsed12312312312", parsed.data, body);
    if (!parsed.data.categoryId) {
        parsed.data.categoryId = null;
        // return c.json({ error: "分类不能为空", code: 400 }, 400)
    }
    const result = await db
        .insert(posts)
        .values(parsed.data)
        .returning();
    if (body.tagIds?.length) {
        await db
            .insert(postTags)
            .values(
                body.tagIds.map((tagId) => ({
                    postId: result[0].id,
                    tagId: tagId,
                }))
            );
    }
    return c.json(result, 200);
});

// 更新文章接口
app.patch("/posts/:item", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user)
        return c.json({ code: 401, message: "Unauthorized" }, 401);
    // 获取文章id，从param中获取
    const item = c.req.param("item");
    const itemParsed = uuidSchema.safeParse(item);
    if (!itemParsed.success)
        return c.json(
            {
                error: "验证失败",
                code: 400,
                details: itemParsed.error.flatten().fieldErrors,
            },
            400
        );
    // 获取文章数据,从body中获取
    const body = await c.req.json();
    const bodyParsed = postSchema.safeParse(body);
    if (!bodyParsed.success)
        return c.json(
            {
                error: "验证失败",
                code: 400,
                details: bodyParsed.error.flatten().fieldErrors,
            },
            400
        );
    const result = await db
        .update(posts)
        .set(bodyParsed.data)
        .where(eq(posts.id, item))
        .returning();
    if (!result[0]) return c.json({ error: "无信息", code: 404 });
    if (body.tagIds?.length) {
        await db.delete(postTags).where(eq(postTags.postId, item));
        await db
            .insert(postTags)
            .values(
                body.tagIds.map((tagId) => ({ postId: item, tagId: tagId }))
            );
    }
    return c.json(result, 200);
});

// 删除文章接口
app.delete("/posts/:item", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user)
        return c.json({ code: 401, message: "Unauthorized" }, 401);

    const item = c.req.param("item");
    const itemParsed = uuidSchema.safeParse(item);
    if (!itemParsed.success)
        return c.json(
            {
                error: "验证失败",
                code: 400,
                details: itemParsed.error.flatten().fieldErrors,
            },
            400
        );
    const result = await db
        .delete(posts)
        .where(eq(posts.id, item))
        .returning();
    if (!result[0]) return c.json({ error: "无信息", code: 404 });
    return c.json(result, 200);
});

// 所有分类
app.get("/categories", async (c) => {
    const result = await db
        .select()
        .from(categories)
        .orderBy(asc(categories.name));
    return c.json(result, 200);
});
// 根据id或slug获取分类面包屑
app.get("/categories/breadcrumb/:item", async (c) => {
    const item = c.req.param("item");
    const parsed = uuidSchema.safeParse(item);
    const result = await db
        .select()
        .from(categories)
        .where(
            parsed.success ? eq(categories.id, item) : eq(categories.slug, item)
        );
    if (!result[0]) return c.json({ error: "无信息", code: 404 });
    const breadcrumb = [];
    while (result[0].parentId) {
        const parent = await db
            .select()
            .from(categories)
            .where(eq(categories.id, result[0].parentId));
        if (parent[0]) {
            breadcrumb.push(parent[0]);
            result[0] = parent[0];
        }
    }
    breadcrumb.push(result[0]);
    return c.json(breadcrumb, 200);
});
// 所有标签
app.get("/tags", async (c) => {
    const result = await db
        .select()
        .from(tags)
        .orderBy(asc(tags.name));
    return c.json(result, 200);
});
// 根据id或slug获取标签
app.get("/tags/:item", async (c) => {
    const item = c.req.param("item");
    const parsed = uuidSchema.safeParse(item);
    const result = await db
        .select()
        .from(tags)
        .where(
            parsed.success ? eq(tags.id, item) : eq(tags.slug, item)
        );
    if (!result[0]) return c.json({ error: "无信息", code: 404 });
    return c.json(result, 200);
});
// app.onError((err, c) => c.json({ error: "Internal error123" }, 500))


export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);
export const HEAD = handle(app);
