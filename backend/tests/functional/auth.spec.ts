import { test } from '@japa/runner'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Auth API', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('POST /api/register - creates new user and returns token', async ({ client }) => {
    const response = await client.post('/api/register').json({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          fullName: 'John Doe',
          email: 'john@example.com',
        },
        token: {
          type: 'Bearer',
        },
      },
    })

    // Verify user was created in database
    const user = await User.findBy('email', 'john@example.com')
    response.assert?.isNotNull(user)
    response.assert?.equal(user?.fullName, 'John Doe')
  })

  test('POST /api/register - rejects duplicate email', async ({ client }) => {
    // Create first user
    await User.create({
      fullName: 'First User',
      email: 'duplicate@example.com',
      password: 'password123',
    })

    // Try to create second user with same email
    const response = await client.post('/api/register').json({
      fullName: 'Second User',
      email: 'duplicate@example.com',
      password: 'password456',
    })

    response.assertStatus(409)
    response.assertBodyContains({
      success: false,
      message: 'User with this email already exists',
    })
  })

  test('POST /api/register - validates input', async ({ client }) => {
    const response = await client.post('/api/register').json({
      fullName: 'J', // Too short
      email: 'invalid-email', // Invalid format
      password: 'short', // Too short
    })

    response.assertStatus(422)
  })

  test('POST /api/login - authenticates user and returns token', async ({ client }) => {
    // Create a user first
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const response = await client.post('/api/login').json({
      email: 'test@example.com',
      password: 'password123',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          fullName: 'Test User',
          email: 'test@example.com',
        },
        token: {
          type: 'Bearer',
        },
      },
    })
  })

  test('POST /api/login - rejects invalid credentials', async ({ client }) => {
    await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const response = await client.post('/api/login').json({
      email: 'test@example.com',
      password: 'wrong-password',
    })

    response.assertStatus(401)
    response.assertBodyContains({
      success: false,
      message: 'Invalid credentials',
    })
  })

  test('GET /api/profile - returns user profile when authenticated', async ({ client }) => {
    const user = await User.create({
      fullName: 'Profile User',
      email: 'profile@example.com',
      password: 'password123',
    })

    const token = await User.accessTokens.create(user)

    const response = await client
      .get('/api/profile')
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      data: {
        user: {
          id: user.id,
          fullName: 'Profile User',
          email: 'profile@example.com',
        },
      },
    })
  })

  test('GET /api/profile - rejects unauthenticated request', async ({ client }) => {
    const response = await client.get('/api/profile')

    response.assertStatus(401)
  })

  test('PUT /api/password - changes user password', async ({ client }) => {
    const user = await User.create({
      fullName: 'Password User',
      email: 'password@example.com',
      password: 'old-password',
    })

    const token = await User.accessTokens.create(user)

    const response = await client
      .put('/api/password')
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json({
        currentPassword: 'old-password',
        newPassword: 'new-password-123',
      })

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Password changed successfully',
    })
  })

  test('PUT /api/password - rejects wrong current password', async ({ client }) => {
    const user = await User.create({
      fullName: 'Password User',
      email: 'password2@example.com',
      password: 'correct-password',
    })

    const token = await User.accessTokens.create(user)

    const response = await client
      .put('/api/password')
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json({
        currentPassword: 'wrong-password',
        newPassword: 'new-password-123',
      })

    response.assertStatus(400)
    response.assertBodyContains({
      success: false,
      message: 'Current password is incorrect',
    })
  })

  test('POST /api/logout - logs out user', async ({ client }) => {
    const user = await User.create({
      fullName: 'Logout User',
      email: 'logout@example.com',
      password: 'password123',
    })

    const token = await User.accessTokens.create(user)

    const response = await client
      .post('/api/logout')
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Logged out successfully',
    })
  })
})
