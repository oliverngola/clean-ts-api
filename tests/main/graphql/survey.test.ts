import { setupApp } from '@/main/config/app'
import { MongoHelper } from '@/infra/db'
import env from '@/main/config/env'

import { Express } from 'express'
import { Collection } from 'mongodb'
import jwt from 'jsonwebtoken'
import request from 'supertest'

let accountCollection: Collection
let surveyCollection: Collection
let app: Express

const makeAccesssToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Oliveira Ngola',
    email: 'ongola123@gmail.com',
    password: '123',
    role: 'admin'
  })
  const id = res.insertedId.toHexString()
  const accessToken = jwt.sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: res.insertedId
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

describe('Surveys GraphQL', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Surveys Query', () => {
    const query = `query surveys {
      surveys {
        id
        question
        answers {
          image
          answer
        }
        date
        didAnswer
      }
    }`

    test('Should return Surveys', async () => {
      const accessToken = await makeAccesssToken()
      const now = new Date()
      await surveyCollection.insertOne({
        question: 'Question',
        answers: [
          {
            image: 'http://image-name.com',
            answer: 'Answer 1'
          },
          {
            answer: 'Answer 2'
          }
        ],
        date: now
      })
      const res = await request(app).post('/graphql').set('x-access-token',accessToken).send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.surveys.length).toBe(1)
      expect(res.body.data.surveys[0].id).toBeTruthy()
      expect(res.body.data.surveys[0].question).toBe('Question')
      expect(res.body.data.surveys[0].answers).toEqual([
        {
          image: 'http://image-name.com',
          answer: 'Answer 1'
        },
        {
          image: null,
          answer: 'Answer 2'
        }
      ])
      expect(res.body.data.surveys[0].date).toBe(now.toISOString())
      expect(res.body.data.surveys[0].didAnswer).toBe(false)
    })

    test('Should return AcessDeniedError if no acessToken is provided', async () => {
      const res = await request(app).post('/graphql').send({ query })
      expect(res.status).toBe(403)
      expect(res.body.errors[0].message).toBe('Access denied')
    })
  })
})
