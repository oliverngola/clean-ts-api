import { mockAccountModel } from '@/tests/domain/mocks'
import { AccountModel, AuthenticationModel } from '@/domain/models'
import {
  AddAccount,
  AddAccountParams,
  Authentication,
  AuthenticationParams,
  LoadAccountByToken
} from '@/domain/usecases'
import faker from 'faker'

export class AddAccountSpy implements AddAccount {
  accountModel = mockAccountModel()
  addAccountParams: AddAccountParams

  async add (account: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = account
    return Promise.resolve(this.accountModel)
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  authenticationModel = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.findName()
  }

  async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
    this.authenticationParams = authentication
    return Promise.resolve(this.authenticationModel)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel = mockAccountModel()
  accessToken: string
  role: string

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken
    this.role = role
    return Promise.resolve(this.accountModel)
  }
}
