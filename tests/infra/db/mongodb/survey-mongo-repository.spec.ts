import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import { MongoHelper, SurveyMongoRepository } from '@/infra/db'
import { Collection, ObjectId } from 'mongodb'
import FakeObjectId from 'bson-objectid'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return res.insertedId.toHexString()
}

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
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
    surveyResultCollection = MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyParams())
      const count = await surveyCollection.countDocuments()
      expect(count).toBe(1)
    })
  })

  describe('loadAll()', () => {
    test('Should loadAll survey on success', async () => {
      const accountId = await makeAccountId()
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      const result = await surveyCollection.insertMany(addSurveyModels)
      const survey = await surveyCollection.findOne({ _id: result.insertedIds[0] })
      await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId: new ObjectId(accountId),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should loadAll empty list', async () => {
      const account = await makeAccountId()
      const sut = makeSut()
      const surveys = await sut.loadAll(account)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const sut = makeSut()
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const id = res.insertedId.toHexString()
      const survey = await sut.loadById(id)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })

    test('Should return null if survey does not exists', async () => {
      const sut = makeSut()
      const survey = await sut.checkById(`${(new FakeObjectId()).toHexString()}`)
      expect(survey).toBeFalsy()
    })
  })

  describe('loadAnswers()', () => {
    test('Should load answers on success', async () => {
      const sut = makeSut()
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const survey = await surveyCollection.findOne({ _id: res.insertedId })
      const answers = await sut.loadAnswers(survey._id.toHexString())
      expect(answers).toEqual([
        survey.answers[0].answer,
        survey.answers[1].answer
      ])
    })

    test('Should return empty array if survey does not exists', async () => {
      const sut = makeSut()
      const answers = await sut.loadAnswers(`${(new FakeObjectId()).toHexString()}`)
      expect(answers).toEqual([])
    })
  })

  describe('checkById()', () => {
    test('Should return true if survey exists', async () => {
      const sut = makeSut()
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const id = res.insertedId.toHexString()
      const exists = await sut.checkById(id)
      expect(exists).toBe(true)
    })

    test('Should return false if survey does not exists', async () => {
      const sut = makeSut()
      const exists = await sut.checkById(`${(new FakeObjectId()).toHexString()}`)
      expect(exists).toBe(false)
    })
  })
})
