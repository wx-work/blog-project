import "dotenv/config";
import db from "@/database/client";
import { categories, posts, tags } from "@/database/schema";

async function seed() {

    // await db.insert(posts).values([{
    //     title: '标题',
    //     summary: 'summary',
    //     body: '正文',
    //     slug: 'my-first-post',
    //     thumb: 'https://via.placeholder.com/150',
    //     keywords: '关键词',
    //     description: '描述',
    // },
    // {
    //     title: '标题123',
    //     summary: 'summary123',
    //     body: '正文123',
    //     slug: 'my-second-post',
    //     thumb: 'https://via.placeholder.com/asdasdas',
    //     keywords: '关键词1123',
    //     description: '描述123213',
    // }]);
    await db.insert(categories).values([{
        name: '生活',
        slug: 'life',
    },
    {
        name: '技术',
        slug: 'technology',
    },
    {
        name: '工作',
        slug: 'work',
    }]);
    await db.insert(tags).values([{
        name: 'Next.js',
        slug: 'nextjs',
    },
    {
        name: 'TypeScript',
        slug: 'typescript',
    },
    {
        name: 'Python',
        slug: 'python',
    },
    {
        name: '前端',
        slug: 'frontend',
    },
    {
        name: '后端',
        slug: 'backend',
    },
    {
        name: '全栈',
        slug: 'fullstack',
    },
    {
        name: '情感',
        slug: 'emotion',
    },
    {
        name: '心理',
        slug: 'psychology',
    },
    {
        name: '家庭',
        slug: 'family',
    },
    {
        name: '其他',
        slug: 'other',
    }
]);

    // await db.select().from(posts);
}

seed()
    .then(() => {
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });