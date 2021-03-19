import { Controller } from '../../../../../presentation/protocols'
import { LoginControler } from '../../../../../presentation/controllers/auth/login/login-controller'
import { makeDbAuthentication } from '../../../usecases/account/authentication/db-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const controller = new LoginControler(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(controller)
}
