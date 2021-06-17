import { makeLoginValidation } from './login-validation-factory'
import { makeLogControllerDecorator, makeDbAuthentication } from '@/main/factories'
import { Controller } from '@/presentation/protocols'
import { LoginControler } from '@/presentation/controllers'

export const makeLoginController = (): Controller => {
  const controller = new LoginControler(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(controller)
}
