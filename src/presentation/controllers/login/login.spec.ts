import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helpers'
import { LoginControler } from './login'

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const sut = new LoginControler()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const sut = new LoginControler()
    const httpRequest = {
      body: {
        email: 'any_email'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
