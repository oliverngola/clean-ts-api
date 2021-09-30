import { setupApp } from '@/main/config/app'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('CORS Middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

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
