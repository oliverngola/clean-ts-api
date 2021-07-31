import { Validation } from '@/presentation/protocols'

export class ValidationSpy implements Validation {
  result: Error = null
  input: any

  validate (input: any): Error {
    this.input = input
    return this.result
  }
}
