import { makeLoginValidation } from './login-validation-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory'
import { Controller } from '@/presentation/protocols'
import { LoginControler } from '@/presentation/controllers/auth/login/login-controller'

export const makeLoginController = (): Controller => {
  const controller = new LoginControler(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(controller)
}
