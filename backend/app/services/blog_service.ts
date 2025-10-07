// app/Services/BlogService.ts
import PostRepository from '#repositories/post_repository'

export default class BlogService {
  constructor(private postRepository: PostRepository) {}

  list(page: number, limit: number) {
    return this.postRepository.paginate(page, limit)
  }

  find(id: number) {
    return this.postRepository.findById(id)
  }

  create(data: { title: string; content: string }, userId: number) {
    return this.postRepository.create({ ...data, authorId: userId })
  }

  async update(id: number, userId: number, data: { title?: string; content?: string }) {
    const post = await this.postRepository.findOrFail(id)
    if (post.authorId !== userId) {
      throw new Error('UNAUTHORIZED')
    }
    return this.postRepository.update(post, data)
  }

  async delete(id: number, userId: number) {
    const post = await this.postRepository.findOrFail(id)
    if (post.authorId !== userId) {
      throw new Error('UNAUTHORIZED')
    }
    await this.postRepository.delete(post)
  }
}
