import { DbAddSurvey } from './db-add-survey'
import {
  AddSurveyModel,
  AddSurveyRepository
} from './db-add-survey-protocols'
import Mockdate from 'mockdate'

const makeAddSurveyRepository = (): any => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyModel): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }

  return new AddSurveyRepositoryStub()
}

const makeFakeAddSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: new Date()
})

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRespositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRespositoryStub = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRespositoryStub)
  return { sut, addSurveyRespositoryStub }
}

describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRespositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRespositoryStub, 'add')
    await sut.add(makeFakeAddSurveyData())
    expect(addSpy).toHaveBeenCalledWith(makeFakeAddSurveyData())
  })

  test('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRespositoryStub } = makeSut()
    jest.spyOn(addSurveyRespositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeAddSurveyData())
    await expect(promise).rejects.toThrow()
  })
})
