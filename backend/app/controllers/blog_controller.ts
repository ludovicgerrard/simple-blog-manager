import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import { createPostValidator, updatePostValidator } from '#validators/blog'

export default class BlogController {
  /**
   * List all blog posts with pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const posts = await Post.query()
        .preload('author', (query) => {
          query.select(['id', 'fullName', 'email'])
        })
        .orderBy('createdAt', 'desc')
        .paginate(page, limit)

      return response.json({
        success: true,
        data: {
          posts: posts.serialize(),
        },
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Failed to fetch posts',
        error: error.message,
      })
    }
  }

  /**
   * View a specific blog post
   */
  async show({ params, response }: HttpContext) {
    try {
      const post = await Post.query()
        .where('id', params.id)
        .preload('author', (query) => {
          query.select(['id', 'fullName', 'email'])
        })
        .firstOrFail()

      return response.json({
        success: true,
        data: {
          post: post.serialize(),
        },
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).json({
          success: false,
          message: 'Post not found',
        })
      }
      return response.status(500).json({
        success: false,
        message: 'Failed to fetch post',
        error: error.message,
      })
    }
  }

  /**
   * Create a new blog post
   */
  async store({ request, response, auth }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(createPostValidator)

      const post = await Post.create({
        title: payload.title,
        content: payload.content,
        authorId: user.id,
      })

      // Load the author relationship
      await post.load('author', (query) => {
        query.select(['id', 'fullName', 'email'])
      })

      return response.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: {
          post: post.serialize(),
        },
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Failed to create post',
        error: error.message,
      })
    }
  }

  /**
   * Update a blog post (only by the author)
   */
  async update({ params, request, response, auth }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(updatePostValidator)

      const post = await Post.findOrFail(params.id)

      // Check if user is the author
      if (post.authorId !== user.id) {
        return response.status(403).json({
          success: false,
          message: 'You can only edit your own posts',
        })
      }

      // Update only provided fields
      if (payload.title !== undefined) {
        post.title = payload.title
      }
      if (payload.content !== undefined) {
        post.content = payload.content
      }

      await post.save()

      // Load the author relationship
      await post.load('author', (query) => {
        query.select(['id', 'fullName', 'email'])
      })

      return response.json({
        success: true,
        message: 'Post updated successfully',
        data: {
          post: post.serialize(),
        },
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).json({
          success: false,
          message: 'Post not found',
        })
      }
      return response.status(500).json({
        success: false,
        message: 'Failed to update post',
        error: error.message,
      })
    }
  }

  /**
   * Delete a blog post (only by the author)
   */
  async destroy({ params, response, auth }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const post = await Post.findOrFail(params.id)

      // Check if user is the author
      if (post.authorId !== user.id) {
        return response.status(403).json({
          success: false,
          message: 'You can only delete your own posts',
        })
      }

      await post.delete()

      return response.json({
        success: true,
        message: 'Post deleted successfully',
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).json({
          success: false,
          message: 'Post not found',
        })
      }
      return response.status(500).json({
        success: false,
        message: 'Failed to delete post',
        error: error.message,
      })
    }
  }
}
