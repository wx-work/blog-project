"use client";

import { useRouter } from "next/navigation";
import { postApi } from "@/api/post";
import { useState } from "react";


export default function DeleteBtn({ id }: { id: string }) {
    const router = useRouter();
    const [error, setError] = useState<any>(null);


    const handleDelete = async () => {
        const confirmed = window.confirm("确定要删除吗？");
        try {
            if (confirmed) {
                await postApi.delete(id);
                router.push("/blog");
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : '删除失败');
        }

    }
    return (
        <>
            <button
                className="text-sm font-medium text-[var(--accent)] hover:underline"
                onClick={handleDelete}
            >
                删除
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </>
    );
}