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
        image: 'http://image-name.com',
        answer: 'Answer 1'
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
            image
            answer
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
      expect(res.data.surveyResult.date).toBe(survey.date.toISOString())
    })
  })
})
