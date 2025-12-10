export interface BlogLight {
    id: number,
    title: string,
    slug: string,
    excerpt: string,
    status: string,
    authorId: string,
    readingTime: number,
    isPinned: boolean,
    pinnedUntil: string,
    tags: string[],
    createdAt: Date,
    updatedAt: Date,
    publishedAt: Date
}

export interface Blog extends BlogLight {
    content: string,
}