import { Hasher, AddAccountRepository, LoadAccountByEmailRepository } from '@/data/protocols'
import { AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRespository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    let isValid = false
    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      isValid = await this.addAccountRespository.add({ ...accountData, password: hashedPassword })
    }
    return isValid
  }
}
