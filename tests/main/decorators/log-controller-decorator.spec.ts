import { LogErrorRepositorySpy } from '@/tests/data/mocks'
import { LogControllerDecorator } from '@/main/decorators'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { serverError, ok } from '@/presentation/helpers'
import faker from 'faker'

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

class ControllerSpy implements Controller {
  httpResponse = ok(faker.datatype.uuid())
  request: any

  async handle (request: any): Promise<HttpResponse> {
    this.request = request
    return Promise.resolve(this.httpResponse)
  }
}

type SutTypes = {
  sut: LogControllerDecorator
  controllerSpy: ControllerSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
}

const makeSut = (): SutTypes => {
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const controllerSpy = new ControllerSpy()
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)
  return { sut, controllerSpy, logErrorRepositorySpy }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerSpy } = makeSut()
    const request = faker.lorem.sentence()
    await sut.handle(request)
    expect(controllerSpy.request).toEqual(request)
  })

  test('Should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSut()
    const httpResponse = await sut.handle(faker.lorem.sentence())
    expect(httpResponse).toEqual(controllerSpy.httpResponse)
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    const serverError = mockServerError()
    controllerSpy.httpResponse = serverError
    await sut.handle(faker.lorem.sentence())
    expect(logErrorRepositorySpy.stack).toBe(serverError.body.stack)
  })
})
