import { setupApp } from '@/main/config/app'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('Body Parser Middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  test('Shoud parse body as JSON', async () => {
    app.post('/test_body_parser', (request, response) => {
      return response.json(request.body)
    })

    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Oliver Creative' })
      .expect({ name: 'Oliver Creative' })
  })
})
