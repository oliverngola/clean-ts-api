import { Validation } from '@/presentation/protocols'
import { ValidateComposite, RequiredFieldValidation } from '@/validation/validators'

export const makeAddSurveyValidation = (): ValidateComposite => {
  const validations: Validation[] = []
  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidateComposite(validations)
}
