import { test } from '@japa/runner'
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
} from '#validators/auth'

// Helper to assert validation failures without relying on exact error message text
async function expectValidationError(promise: Promise<unknown>, field?: string) {
  try {
    await promise
  } catch (error: any) {
    // VineJS throws E_VALIDATION_ERROR with a `messages` bag
    if (field) {
      // messages may be an array or object depending on configuration
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
 * registerValidator
 */

test.group('registerValidator', () => {
  test('accepts valid payload and normalizes email', async ({ assert }) => {
    const input = {
      fullName: '  John Doe  ',
      email: 'JoHn@ExAmPlE.com',
      password: 'password123',
    }

    const output = await registerValidator.validate(input)

    assert.equal(output.fullName, 'John Doe')
    assert.equal(output.email, 'john@example.com')
    assert.equal(output.password, 'password123')
  })

  test('rejects short fullName', async ({ assert }) => {
    const input = {
      fullName: 'J',
      email: 'john@example.com',
      password: 'password123',
    }

    const failedOnFullName = await expectValidationError(
      registerValidator.validate(input),
      'fullName'
    )
    assert.isTrue(!!failedOnFullName)
  })

  test('rejects invalid email', async ({ assert }) => {
    const input = {
      fullName: 'John Doe',
      email: 'not-an-email',
      password: 'password123',
    }

    const failedOnEmail = await expectValidationError(registerValidator.validate(input), 'email')
    assert.isTrue(!!failedOnEmail)
  })

  test('rejects short password', async ({ assert }) => {
    const input = {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'short',
    }

    const failedOnPassword = await expectValidationError(
      registerValidator.validate(input),
      'password'
    )
    assert.isTrue(!!failedOnPassword)
  })
})

/**
 * loginValidator
 */

test.group('loginValidator', () => {
  test('accepts valid payload', async ({ assert }) => {
    const input = {
      email: 'john@example.com',
      password: 'password123',
    }

    const output = await loginValidator.validate(input)
    assert.equal(output.email, 'john@example.com')
    assert.equal(output.password, 'password123')
  })

  test('rejects missing password', async ({ assert }) => {
    const input = {
      email: 'john@example.com',
    }

    const failedOnPassword = await expectValidationError(
      loginValidator.validate(input as any),
      'password'
    )
    assert.isTrue(!!failedOnPassword)
  })
})

/**
 * updateProfileValidator
 */

test.group('updateProfileValidator', () => {
  test('allows empty payload (no updates)', async ({ assert }) => {
    const output = await updateProfileValidator.validate({})
    assert.isUndefined((output as any).fullName)
  })

  test('rejects provided fullName that is too short', async ({ assert }) => {
    const failed = await expectValidationError(
      updateProfileValidator.validate({ fullName: 'A' }),
      'fullName'
    )
    assert.isTrue(!!failed)
  })

  test('accepts provided fullName when valid', async ({ assert }) => {
    const output = await updateProfileValidator.validate({ fullName: 'Jane Doe' })
    assert.equal(output.fullName, 'Jane Doe')
  })
})

/**
 * changePasswordValidator
 */

test.group('changePasswordValidator', () => {
  test('accepts valid payload', async ({ assert }) => {
    const output = await changePasswordValidator.validate({
      currentPassword: 'old-password',
      newPassword: 'new-password-123',
    })

    assert.equal(output.currentPassword, 'old-password')
    assert.equal(output.newPassword, 'new-password-123')
  })

  test('rejects short newPassword', async ({ assert }) => {
    const failed = await expectValidationError(
      changePasswordValidator.validate({ currentPassword: 'old', newPassword: 'short' }),
      'newPassword'
    )
    assert.isTrue(!!failed)
  })
})
