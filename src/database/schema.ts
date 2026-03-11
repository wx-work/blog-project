import { primaryKey, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    parentId: uuid("parent_id").references(() => categories.id),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const tags = pgTable("tags", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const posts = pgTable("posts", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    summary: text("summary"),
    body: text("body").notNull(),
    slug: text("slug").unique(),
    thumb: text("thumb"),
    keywords: text("keywords"),
    description: text("description"),
    categoryId: uuid("category_id").references(() => categories.id),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const postTags = pgTable(
    "post_tags",
    {
        postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
        tagId: uuid("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
    },
    (t) => [primaryKey({ columns: [t.postId, t.tagId] })],
);
