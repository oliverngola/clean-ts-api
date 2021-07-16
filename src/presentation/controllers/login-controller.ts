import { Controller, HttpResponse, Validation } from '@/presentation/protocols'
import { badRequest, ok, serverError,unauthorized } from '@/presentation/helpers'
import { Authentication } from '@/domain/usecases'

export class LoginControler implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (request: LoginControler.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { email , password } = request
      const authenticationModel = await this.authentication.auth({ email, password })
      if (!authenticationModel) {
        return unauthorized()
      }
      return ok(authenticationModel)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoginControler {
  export type Request = {
    email: string
    password: string
  }
}
