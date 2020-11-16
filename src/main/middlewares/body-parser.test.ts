import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
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
