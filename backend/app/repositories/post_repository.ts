// app/Repositories/PostRepository.ts
import Post from '#models/post'

export default class PostRepository {
  async paginate(page: number, limit: number) {
    return Post.query()
      .preload('author', (query) => query.select(['id', 'fullName', 'email']))
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  async findById(id: number) {
    return Post.query()
      .where('id', id)
      .preload('author', (query) => query.select(['id', 'fullName', 'email']))
      .firstOrFail()
  }

  async create(data: { title: string; content: string; authorId: number }) {
    const post = await Post.create(data)
    await post.load('author', (query) => query.select(['id', 'fullName', 'email']))
    return post
  }

  async update(post: Post, data: { title?: string; content?: string }) {
    if (data.title !== undefined) post.title = data.title
    if (data.content !== undefined) post.content = data.content
    await post.save()
    await post.load('author', (query) => query.select(['id', 'fullName', 'email']))
    return post
  }

  async delete(post: Post) {
    await post.delete()
  }

  async findOrFail(id: number) {
    return Post.findOrFail(id)
  }
}
