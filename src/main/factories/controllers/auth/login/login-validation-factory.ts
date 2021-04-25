import { Validation } from '../../../../../presentation/protocols/validation'
import {
  ValidateComposite,
  EmailValidation,
  RequiredFieldValidation
} from '../../../../../validation/validators'
import { EmailValidatorAdapter } from '../../../../../infra/validators/email-validator-adapter'

export const makeLoginValidation = (): ValidateComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidateComposite(validations)
}
