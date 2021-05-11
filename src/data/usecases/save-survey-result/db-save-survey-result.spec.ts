import { DbSaveSurveyResult } from './db-save-survey-result'
import {
  SurveyResultModel,
  SaveSurveyResultModel,
  SaveSurveyResultRepository
} from './db-save-survey-result-protocols'
import Mockdate from 'mockdate'

const makeSaveSurveyResultRepository = (): any => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeFakeSurveyResult()))
    }
  }

  return new SaveSurveyResultRepositoryStub()
}

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
})

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'any_id', ...makeFakeSurveyResultData()
})

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRespositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRespositoryStub = makeSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRespositoryStub)
  return { sut, saveSurveyResultRespositoryStub }
}

describe('DbSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRespositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRespositoryStub, 'save')
    await sut.save(makeFakeSurveyResultData())
    expect(saveSpy).toHaveBeenCalledWith(makeFakeSurveyResultData())
  })
})
