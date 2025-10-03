import vine from '@vinejs/vine'

/**
 * Validator for creating a new blog post
 */
export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255),
    content: vine.string().trim().minLength(1).maxLength(10000), // Reasonable limit for content
  })
)

/**
 * Validator for updating a blog post
 */
export const updatePostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255).optional(),
    content: vine.string().trim().minLength(1).maxLength(10000).optional(),
  })
)
