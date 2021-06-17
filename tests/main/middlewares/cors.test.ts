import app from '@/main/config/app'
import request from 'supertest'

describe('CORS Middleware', () => {
  test('Should enabale CORS', async () => {
    app.get('/test_cors', (request, response) => {
      return response.json({})
    })

    const response = await request(app).get('/test_cors')
    expect(response.headers['access-origin-allow-control']).toBe('*')
    expect(response.headers['access-origin-allow-methods']).toBe('*')
    expect(response.headers['access-origin-allow-headers']).toBe('*')
  })
})
