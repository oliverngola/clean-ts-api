import { Validation } from '@/presentation/protocols'
import {
  ValidateComposite,
  EmailValidation,
  RequiredFieldValidation,
  CompareFieldsValidation
} from '@/validation/validators'
import { EmailValidatorAdapter } from '@/infra/validators'

export const makeSignUpValidation = (): ValidateComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidateComposite(validations)
}
