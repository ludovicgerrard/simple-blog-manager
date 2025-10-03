import { test } from '@japa/runner'
import { createPostValidator, updatePostValidator } from '#validators/blog'

// Helper to assert validation failures
async function expectValidationError(promise: Promise<unknown>, field?: string) {
  try {
    await promise
  } catch (error: any) {
    if (field) {
      const msgs = error?.messages
      if (Array.isArray(msgs)) {
        return msgs.some((m) => m.field === field)
      }
      if (msgs && typeof msgs === 'object') {
        return Object.prototype.hasOwnProperty.call(msgs, field)
      }
      return true
    }
    return true
  }
  throw new Error('Expected validation to fail, but it passed')
}

/**
 * createPostValidator
 */

test.group('createPostValidator', () => {
  test('accepts valid post data and trims whitespace', async ({ assert }) => {
    const input = {
      title: '  My Blog Post Title  ',
      content: '  This is the content of my blog post with some interesting information.  ',
    }

    const output = await createPostValidator.validate(input)

    assert.equal(output.title, 'My Blog Post Title')
    assert.equal(
      output.content,
      'This is the content of my blog post with some interesting information.'
    )
  })

  test('rejects empty title', async ({ assert }) => {
    const input = {
      title: '',
      content: 'Valid content here',
    }

    const failedOnTitle = await expectValidationError(createPostValidator.validate(input), 'title')
    assert.isTrue(!!failedOnTitle)
  })

  test('rejects title with only whitespace', async ({ assert }) => {
    const input = {
      title: '   ',
      content: 'Valid content here',
    }

    const failedOnTitle = await expectValidationError(createPostValidator.validate(input), 'title')
    assert.isTrue(!!failedOnTitle)
  })

  test('rejects title longer than 255 characters', async ({ assert }) => {
    const input = {
      title: 'a'.repeat(256),
      content: 'Valid content here',
    }

    const failedOnTitle = await expectValidationError(createPostValidator.validate(input), 'title')
    assert.isTrue(!!failedOnTitle)
  })

  test('accepts title exactly 255 characters', async ({ assert }) => {
    const input = {
      title: 'a'.repeat(255),
      content: 'Valid content here',
    }

    const output = await createPostValidator.validate(input)
    assert.equal(output.title.length, 255)
  })

  test('rejects empty content', async ({ assert }) => {
    const input = {
      title: 'Valid title',
      content: '',
    }

    const failedOnContent = await expectValidationError(
      createPostValidator.validate(input),
      'content'
    )
    assert.isTrue(!!failedOnContent)
  })

  test('rejects content with only whitespace', async ({ assert }) => {
    const input = {
      title: 'Valid title',
      content: '   \n\t   ',
    }

    const failedOnContent = await expectValidationError(
      createPostValidator.validate(input),
      'content'
    )
    assert.isTrue(!!failedOnContent)
  })

  test('rejects content longer than 10000 characters', async ({ assert }) => {
    const input = {
      title: 'Valid title',
      content: 'a'.repeat(10001),
    }

    const failedOnContent = await expectValidationError(
      createPostValidator.validate(input),
      'content'
    )
    assert.isTrue(!!failedOnContent)
  })

  test('accepts content exactly 10000 characters', async ({ assert }) => {
    const input = {
      title: 'Valid title',
      content: 'a'.repeat(10000),
    }

    const output = await createPostValidator.validate(input)
    assert.equal(output.content.length, 10000)
  })

  test('rejects missing title field', async ({ assert }) => {
    const input = {
      content: 'Valid content here',
    }

    const failedOnTitle = await expectValidationError(
      createPostValidator.validate(input as any),
      'title'
    )
    assert.isTrue(!!failedOnTitle)
  })

  test('rejects missing content field', async ({ assert }) => {
    const input = {
      title: 'Valid title',
    }

    const failedOnContent = await expectValidationError(
      createPostValidator.validate(input as any),
      'content'
    )
    assert.isTrue(!!failedOnContent)
  })
})

/**
 * updatePostValidator
 */

test.group('updatePostValidator', () => {
  test('allows empty payload (no updates)', async ({ assert }) => {
    const output = await updatePostValidator.validate({})
    assert.isUndefined((output as any).title)
    assert.isUndefined((output as any).content)
  })

  test('accepts valid title update', async ({ assert }) => {
    const input = {
      title: '  Updated Blog Post Title  ',
    }

    const output = await updatePostValidator.validate(input)
    assert.equal(output.title, 'Updated Blog Post Title')
    assert.isUndefined((output as any).content)
  })

  test('accepts valid content update', async ({ assert }) => {
    const input = {
      content: '  Updated content for the blog post.  ',
    }

    const output = await updatePostValidator.validate(input)
    assert.equal(output.content, 'Updated content for the blog post.')
    assert.isUndefined((output as any).title)
  })

  test('accepts both title and content updates', async ({ assert }) => {
    const input = {
      title: '  Updated Title  ',
      content: '  Updated Content  ',
    }

    const output = await updatePostValidator.validate(input)
    assert.equal(output.title, 'Updated Title')
    assert.equal(output.content, 'Updated Content')
  })

  test('rejects empty title when provided', async ({ assert }) => {
    const input = {
      title: '',
    }

    const failedOnTitle = await expectValidationError(updatePostValidator.validate(input), 'title')
    assert.isTrue(!!failedOnTitle)
  })

  test('rejects empty content when provided', async ({ assert }) => {
    const input = {
      content: '',
    }

    const failedOnContent = await expectValidationError(
      updatePostValidator.validate(input),
      'content'
    )
    assert.isTrue(!!failedOnContent)
  })

  test('rejects title longer than 255 characters', async ({ assert }) => {
    const input = {
      title: 'a'.repeat(256),
    }

    const failedOnTitle = await expectValidationError(updatePostValidator.validate(input), 'title')
    assert.isTrue(!!failedOnTitle)
  })

  test('rejects content longer than 10000 characters', async ({ assert }) => {
    const input = {
      content: 'a'.repeat(10001),
    }

    const failedOnContent = await expectValidationError(
      updatePostValidator.validate(input),
      'content'
    )
    assert.isTrue(!!failedOnContent)
  })
})
