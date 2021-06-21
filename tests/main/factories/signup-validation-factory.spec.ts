import { makeSignUpValidation } from '@/main/factories'
import { Validation } from '@/presentation/protocols'
import {
  ValidateComposite,
  EmailValidation,
  RequiredFieldValidation,
  CompareFieldsValidation
} from '@/validation/validators'
import { EmailValidatorAdapter } from '@/infra/validators'

jest.mock('@/validation/validators/validation-composite')

describe('SigunUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidateComposite).toHaveBeenCalledWith(validations)
  })
})
