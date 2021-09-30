import { setupApp } from '@/main/config/app'
import { SurveyModel } from '@/domain/models'
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

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'Question',
    answers: [
      {
        answer: 'Answer 1',
        image: 'http://image-name.com'
      },
      {
        answer: 'Answer 2'
      }
    ],
    date: new Date()
  })
  const survey = await surveyCollection.findOne({ _id: res.insertedId })
  return MongoHelper.map(survey)
}

describe('SurveyResult GraphQL', () => {
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

  describe('SurveyResult Query', () => {
    test('Should return SurveyResult', async () => {
      const accessToken = await makeAccesssToken()
      const survey = await makeSurvey()
      const query = `query {
        surveyResult (surveyId: "${survey.id.toString()}") {
          surveyId
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }`
      const res = await request(app).post('/graphql').set('x-access-token',accessToken).send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.surveyResult.surveyId).toBe(survey.id.toString())
      expect(res.body.data.surveyResult.question).toBe(survey.question)
      expect(res.body.data.surveyResult.answers).toEqual([{
        answer: 'Answer 1',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }, {
        answer: 'Answer 2',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
      expect(res.body.data.surveyResult.date).toBe(survey.date.toISOString())
    })

    test('Should return AccessDeniedError if no acessToken is provided', async () => {
      const survey = await makeSurvey()
      const query = `query {
        surveyResult (surveyId: "${survey.id.toString()}") {
          surveyId
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }`
      const res = await request(app).post('/graphql').send({ query })
      expect(res.status).toBe(403)
      expect(res.body.errors[0].message).toBe('Access denied')
    })
  })

  describe('SaveSurveyResult Mutation', () => {
    test('Should return SurveyResult', async () => {
      const accessToken = await makeAccesssToken()
      const survey = await makeSurvey()
      const query = `mutation {
        saveSurveyResult (surveyId: "${survey.id.toString()}", answer: "${survey.answers[0].answer}") {
          surveyId
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }`
      const res = await request(app).post('/graphql').set('x-access-token',accessToken).send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.saveSurveyResult.surveyId).toBe(survey.id.toString())
      expect(res.body.data.saveSurveyResult.question).toBe(survey.question)
      expect(res.body.data.saveSurveyResult.answers).toEqual([{
        answer: 'Answer 1',
        count: 1,
        percent: 100,
        isCurrentAccountAnswer: true
      }, {
        answer: 'Answer 2',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
      expect(res.body.data.saveSurveyResult.date).toBe(survey.date.toISOString())
    })

    test('Should return AccessDeniedError if no acessToken is provided', async () => {
      const survey = await makeSurvey()
      const query = `mutation {
        saveSurveyResult (surveyId: "${survey.id.toString()}", answer: "${survey.answers[0].answer}") {
          surveyId
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }`
      const res = await request(app).post('/graphql').send({ query })
      expect(res.status).toBe(403)
      expect(res.body.errors[0].message).toBe('Access denied')
    })
  })
})
