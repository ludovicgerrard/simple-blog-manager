import type { HttpContext } from '@adonisjs/core/http'
import { createPostValidator, updatePostValidator } from '#validators/blog'
import BlogService from '#services/blog_service'
import PostRepository from '#repositories/post_repository'

export default class BlogController {
  private blogService = new BlogService(new PostRepository())

  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const posts = await this.blogService.list(page, limit)

      return response.json({
        success: true,
        data: { posts: posts.serialize() },
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Failed to fetch posts',
        error: error.message,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const post = await this.blogService.find(params.id)
      return response.json({
        success: true,
        data: { post: post.serialize() },
      })
    } catch (error) {
      return response.status(error.code === 'E_ROW_NOT_FOUND' ? 404 : 500).json({
        success: false,
        message: error.code === 'E_ROW_NOT_FOUND' ? 'Post not found' : 'Failed to fetch post',
        error: error.message,
      })
    }
  }

  async store({ request, response, auth }: HttpContext) {
    const user = await auth.getUserOrFail()
    const payload = await request.validateUsing(createPostValidator)

    try {
      const post = await this.blogService.create(payload, user.id)
      return response.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: { post: post.serialize() },
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Failed to create post',
        error: error.message,
      })
    }
  }

  async update({ params, request, response, auth }: HttpContext) {
    const user = await auth.getUserOrFail()
    const payload = await request.validateUsing(updatePostValidator)

    try {
      const post = await this.blogService.update(params.id, user.id, payload)
      return response.json({
        success: true,
        message: 'Post updated successfully',
        data: { post: post.serialize() },
      })
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        return response.status(403).json({
          success: false,
          message: 'You can only edit your own posts',
        })
      }
      return response.status(error.code === 'E_ROW_NOT_FOUND' ? 404 : 500).json({
        success: false,
        message: 'Failed to update post',
        error: error.message,
      })
    }
  }

  async destroy({ params, response, auth }: HttpContext) {
    const user = await auth.getUserOrFail()

    try {
      await this.blogService.delete(params.id, user.id)
      return response.json({
        success: true,
        message: 'Post deleted successfully',
      })
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        return response.status(403).json({
          success: false,
          message: 'You can only delete your own posts',
        })
      }
      return response.status(error.code === 'E_ROW_NOT_FOUND' ? 404 : 500).json({
        success: false,
        message: 'Failed to delete post',
        error: error.message,
      })
    }
  }
}
