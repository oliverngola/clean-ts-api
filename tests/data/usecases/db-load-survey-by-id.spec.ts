import { throwError } from '@/tests/domain/mocks'
import { LoadSurveyByIdRepositorySpy } from '@/tests/data/mocks'
import { DbLoadSurveyById } from '@/data/usecases'
import Mockdate from 'mockdate'
import faker from 'faker'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy)
  return {
    sut, loadSurveyByIdRepositorySpy
  }
}

let surveyId: string

describe('DbLoadSurveyById Usecase', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  beforeEach(() => {
    surveyId = faker.datatype.uuid()
  })

  test('Should call LoadSurveyByIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    await sut.loadById(surveyId)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  test('Should return Survey on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const survey = await sut.loadById(surveyId)
    expect(survey).toEqual(loadSurveyByIdRepositorySpy.surveyModel)
  })

  test('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockImplementationOnce(throwError)
    const promise = sut.loadById(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
