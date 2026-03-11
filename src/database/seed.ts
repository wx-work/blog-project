import "dotenv/config";
import db from "@/database/client";
import { posts } from "@/database/schema";

async function seed() {

    await db.insert(posts).values([{
        title: '标题',
        summary: 'summary',
        body: '正文',
        slug: 'my-first-post',
        thumb: 'https://via.placeholder.com/150',
        keywords: '关键词',
        description: '描述',
    },
    {
        title: '标题123',
        summary: 'summary123',
        body: '正文123',
        slug: 'my-second-post',
        thumb: 'https://via.placeholder.com/asdasdas',
        keywords: '关键词1123',
        description: '描述123213',
    }]);

    await db.select().from(posts);
}

seed()
    .then(() => {
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });