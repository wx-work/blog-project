/**
 * 前端调用 /api/posts 的封装，类型与后端一致。
 * 服务端组件中：await postApi.paginate({ page: 1 })
 */

export type Post = {
  id: string;
  title: string;
  summary: string | null;
  body: string;
  slug: string | null;
  thumb: string | null;
  keywords: string | null;
  description: string | null;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
};

/** 文章详情接口返回：包含关联的 category、tags */
export type PostDetail = Post & {
  category: Array<{ id: string; name: string; slug: string }> | null;
  tags: Array<{ id: string; name: string; slug: string }>;
};

/** 分类（/api/categories 返回项） */
export type Category = { id: string; name: string; slug: string; parentId?: string | null; createdAt?: string; updatedAt?: string };

/** 标签（/api/tags 返回项） */
export type Tag = { id: string; name: string; slug: string; createdAt?: string };
export type TagItem = Tag;

export type PaginateResult = {
  items: Post[];
  total: number;
  currentPage: number;
  totalPages: number;
};

export type CreatePostInput = {
  title: string;
  body: string;
  slug: string;
  summary?: string;
  thumb?: string;
  categoryId?: string;
  tagIds?: string[];
  keywords?: string;
  description?: string;
};

export type UpdatePostInput = Partial<CreatePostInput>;

function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<{ data?: T; error?: { code: number; message: string }; status: number }> {
  const base = getBaseUrl();
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) return { error: body as { code: number; message: string }, status: res.status };
  return { data: body as T, status: res.status };
}

export const postApi = {
  async paginate(
    params: { page?: number; limit?: number; category?: string; tag?: string } = {}
  ): Promise<PaginateResult> {
    const search = new URLSearchParams();
    if (params.page != null) search.set("page", String(params.page));
    if (params.limit != null) search.set("limit", String(params.limit));
    if (params.category) search.set("category", params.category);
    if (params.tag) search.set("tag", params.tag);
    const q = search.toString();
    const { data, error, status } = await apiFetch<PaginateResult>(`/api/posts${q ? `?${q}` : ""}`);
    if (error || !data) throw new Error(error?.message ?? `posts paginate ${status}`);
    return data;
  },

  async detail(item: string): Promise<PostDetail | null> {
    const { data, error, status } = await apiFetch<PostDetail>(`/api/posts/${encodeURIComponent(item)}`);
    if (status === 404) return null;
    if (status === 401) return null;
    if (error || !data) throw new Error(error?.message ?? `posts detail ${status}`);
    return data;
  },

  async create(body: CreatePostInput): Promise<Post> {
    const { data, error, status } = await apiFetch<Post>("/api/posts", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (status === 401) throw new Error(error?.message ?? `posts create ${status}`);
    if (error || !data) throw new Error(error?.message ?? `posts create ${status}`);
    return data;
  },

  async update(id: string, body: UpdatePostInput): Promise<Post> {
    const { data, error, status } = await apiFetch<Post>(`/api/posts/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    if (status === 401) throw new Error(error?.message ?? `posts update ${status}`);
    if (error || !data) throw new Error(error?.message ?? `posts update ${status}`);
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error, status } = await apiFetch<Post>(`/api/posts/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (error) throw new Error(error.message ?? `posts delete ${status}`);
  },
};
