import { ValidationSpy } from '@/tests/presentation/mocks'
import { MissingParamError } from '@/presentation/errors'
import { ValidateComposite } from '@/validation/validators'
import faker from 'faker'

const field = faker.random.word()

type SutTypes = {
  sut: ValidateComposite
  validationSpies: ValidationSpy[]
}

const makeSut = (): SutTypes => {
  const validationSpies = [new ValidationSpy(), new ValidationSpy()]
  const sut = new ValidateComposite(validationSpies)
  return { sut, validationSpies }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationSpies } = makeSut()
    validationSpies[1].result = new MissingParamError(field)
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toEqual(validationSpies[1].result)
  })

  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationSpies } = makeSut()
    validationSpies[0].result = new Error()
    validationSpies[1].result = new MissingParamError(field)
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toEqual(validationSpies[0].result)
  })

  test('Should not return an error if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toBeFalsy()
  })
})
