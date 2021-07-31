import { throwError } from '@/tests/domain/mocks'
import { LoadAnswersBySurveySpy, SaveSurveyResultSpy } from '@/tests/presentation/mocks'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import MockDate from 'mockdate'
import faker from 'faker'

const mockRequest = (answer: string = null): SaveSurveyResultController.Request => ({
  surveyId: faker.datatype.uuid(),
  answer,
  accountId: faker.datatype.uuid()
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadAnswersBySurveySpy: LoadAnswersBySurveySpy
  saveSurveyResultSpy: SaveSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveySpy = new LoadAnswersBySurveySpy()
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const sut = new SaveSurveyResultController(loadAnswersBySurveySpy, saveSurveyResultSpy)
  return {
    sut,
    loadAnswersBySurveySpy,
    saveSurveyResultSpy
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadAnswersBySurvey with correct values', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadAnswersBySurveySpy.id).toBe(request.surveyId)
  })

  test('Should return 403 if LoadAnswersBySurvey return null', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut()
    loadAnswersBySurveySpy.result = []
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadAnswersBySurvey throws', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut()
    jest.spyOn(loadAnswersBySurveySpy, 'loadAnswers').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveySpy } = makeSut()
    const request = mockRequest(loadAnswersBySurveySpy.result[0])
    await sut.handle(request)
    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      surveyId: request.surveyId,
      accountId: request.accountId,
      answer: request.answer,
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveySpy } = makeSut()
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest(loadAnswersBySurveySpy.result[0]))
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveySpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest(loadAnswersBySurveySpy.result[0]))
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.result))
  })
})
