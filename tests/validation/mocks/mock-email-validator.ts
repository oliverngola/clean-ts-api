import { EmailValidator } from '@/validation/protocols'

export class EmailValidatorSpy implements EmailValidator {
  result = true
  email: string

  isValid (email: string): boolean {
    this.email = email
    return this.result
  }
}
