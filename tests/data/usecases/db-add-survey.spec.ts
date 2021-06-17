import { mockAddSurveyParams, throwError } from '@/tests/domain/mocks'
import { mockAddSurveyRepository } from '@/tests/data/mocks'
import { DbAddSurvey } from '@/data/usecases'
import { AddSurveyRepository } from '@/data/protocols'
import Mockdate from 'mockdate'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRespositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRespositoryStub = mockAddSurveyRepository()
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
    await sut.add(mockAddSurveyParams())
    expect(addSpy).toHaveBeenCalledWith(mockAddSurveyParams())
  })

  test('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRespositoryStub } = makeSut()
    jest.spyOn(addSurveyRespositoryStub, 'add').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
