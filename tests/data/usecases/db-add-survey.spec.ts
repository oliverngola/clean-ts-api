import { mockAddSurveyParams, throwError } from '@/tests/domain/mocks'
import { AddSurveyRepositorySpy } from '@/tests/data/mocks'
import { DbAddSurvey } from '@/data/usecases'
import Mockdate from 'mockdate'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRespositorySpy: AddSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const addSurveyRespositorySpy = new AddSurveyRepositorySpy()
  const sut = new DbAddSurvey(addSurveyRespositorySpy)
  return { sut, addSurveyRespositorySpy }
}

describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRespositorySpy } = makeSut()
    const addSurveyParams = mockAddSurveyParams()
    await sut.add(addSurveyParams)
    expect(addSurveyRespositorySpy.addSurveyParams).toEqual(addSurveyParams)
  })

  test('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRespositorySpy } = makeSut()
    jest.spyOn(addSurveyRespositorySpy, 'add').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
