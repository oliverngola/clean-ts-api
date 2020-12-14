import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helpers'
import { Controller, HttpResponse, HttpRequest } from '../../protocols'

export class LoginControler implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
