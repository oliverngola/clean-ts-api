import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

describe('DbAddAccount Usecase', () => {
  test('should call Encrypter with correct password', async () => {
    class EncrypterStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return new Promise(resolve => resolve('hashed_password'))
      }
    }
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encrypterSy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encrypterSy).toHaveBeenCalledWith('valid_password')
  })
})
