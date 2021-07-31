import { AddSurveySpy, ValidationSpy } from '@/tests/presentation/mocks'
import { AddSurveyController } from '@/presentation/controllers'
import { badRequest, serverError, notContent } from '@/presentation/helpers'
import { MissingParamError } from '@/presentation/errors'
import { throwError } from '@/tests/domain/mocks'
import Mockdate from 'mockdate'
import faker from 'faker'

const mockRequest = (): AddSurveyController.Request => ({
  question: faker.random.words(),
  answers: [{
    image: faker.image.imageUrl(),
    answer: faker.random.word()
  }]
})

type SutTypes = {
  sut: AddSurveyController
  validationSpy: ValidationSpy
  addSurveySpy: AddSurveySpy
}

const makeSut = (): SutTypes => {
  const addSurveySpy = new AddSurveySpy()
  const validationSpy = new ValidationSpy()
  const sut = new AddSurveyController(validationSpy, addSurveySpy)
  return { sut, validationSpy, addSurveySpy }
}

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  test('Should calls Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.result = new MissingParamError(faker.random.word())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(validationSpy.result))
  })

  test('Should calls AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(addSurveySpy.addSurveyParams).toEqual({ ...request, date: new Date() })
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveySpy } = makeSut()
    jest.spyOn(addSurveySpy, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(notContent())
  })
})
