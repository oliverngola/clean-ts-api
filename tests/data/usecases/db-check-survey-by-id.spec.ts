import { throwError } from '@/tests/domain/mocks'
import { CheckSurveyByIdRepositorySpy } from '@/tests/data/mocks'
import { DbCheckSurveyById } from '@/data/usecases'
import faker from 'faker'

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositorySpy: CheckSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositorySpy = new CheckSurveyByIdRepositorySpy()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy)
  return {
    sut, checkSurveyByIdRepositorySpy
  }
}

let surveyId: string

describe('DbCheckSurveyById Usecase', () => {
  beforeEach(() => {
    surveyId = faker.datatype.uuid()
  })

  test('Should call CheckSurveyByIdRepository with correct id', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    await sut.checkById(surveyId)
    expect(checkSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  test('Should return true if CheckSurveyByIdRepositorySpy returns true', async () => {
    const { sut } = makeSut()
    const exists = await sut.checkById(surveyId)
    expect(exists).toBe(true)
  })

  test('Should return false if CheckSurveyByIdRepositorySpy returns false', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    checkSurveyByIdRepositorySpy.result = false
    const exists = await sut.checkById(surveyId)
    expect(exists).toBe(false)
  })

  test('should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    jest.spyOn(checkSurveyByIdRepositorySpy, 'checkById').mockImplementationOnce(throwError)
    const promise = sut.checkById(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
