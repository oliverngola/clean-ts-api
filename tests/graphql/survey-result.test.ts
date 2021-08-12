import { makeApolloServer } from './helper'
import { SurveyModel } from '@/domain/models'
import { MongoHelper } from '@/infra/db'
import env from '@/main/config/env'

import { ApolloServer, gql } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-integration-testing'
import { Collection } from 'mongodb'
import jwt from 'jsonwebtoken'

let accountCollection: Collection
let surveyCollection: Collection
let apolloServer: ApolloServer

const makeAccesssToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Oliveira Ngola',
    email: 'oliveiraernestongola123@gmail.com',
    password: '123',
    role: 'admin'
  })
  const id = res.ops[0]._id
  const accessToken = jwt.sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
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
  return MongoHelper.map(res.ops[0])
}

describe('SurveyResult GraphQL', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('SurveyResult Query', () => {
    const surveyResultQuery = gql`
      query surveyResult ($surveyId: String!) {
        surveyResult (surveyId: $surveyId) {
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
      }
    `

    test('Should return SurveyResult', async () => {
      const accessToken = await makeAccesssToken()
      const survey = await makeSurvey()
      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })
      const res: any = await query(surveyResultQuery, {
        variables: {
          surveyId: survey.id.toString()
        }
      })
      expect(res.data.surveyResult.surveyId).toBe(survey.id.toString())
      expect(res.data.surveyResult.question).toBe(survey.question)
      expect(res.data.surveyResult.answers).toEqual([{
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
      expect(res.data.surveyResult.date).toBe(survey.date.toISOString())
    })

    test('Should return AccessDeniedError if no acessToken is provided', async () => {
      const survey = await makeSurvey()
      const { query } = createTestClient({
        apolloServer
      })
      const res: any = await query(surveyResultQuery, {
        variables: {
          surveyId: survey.id.toString()
        }
      })
      expect(res.data).toBeNull()
      expect(res.errors[0].message).toBe('Access denied')
    })
  })

  describe('SaveSurveyResult Mutation', () => {
    const saveSurveyResultMutation = gql`
      mutation saveSurveyResult ($surveyId: String!, $answer: String!) {
        saveSurveyResult (surveyId: $surveyId, answer: $answer) {
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
      }
    `

    test('Should return SurveyResult', async () => {
      const accessToken = await makeAccesssToken()
      const survey = await makeSurvey()
      const { mutate } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })
      const res: any = await mutate(saveSurveyResultMutation, {
        variables: {
          surveyId: survey.id.toString(),
          answer: survey.answers[0].answer
        }
      })
      expect(res.data.saveSurveyResult.surveyId).toBe(survey.id.toString())
      expect(res.data.saveSurveyResult.question).toBe(survey.question)
      expect(res.data.saveSurveyResult.answers).toEqual([{
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
      expect(res.data.saveSurveyResult.date).toBe(survey.date.toISOString())
    })

    test('Should return AccessDeniedError if no acessToken is provided', async () => {
      const survey = await makeSurvey()
      const { mutate } = createTestClient({
        apolloServer
      })
      const res: any = await mutate(saveSurveyResultMutation, {
        variables: {
          surveyId: survey.id.toString(),
          answer: survey.answers[0].answer
        }
      })
      expect(res.data).toBeNull()
      expect(res.errors[0].message).toBe('Access denied')
    })
  })
})
