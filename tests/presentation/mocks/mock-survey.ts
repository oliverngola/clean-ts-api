import { AddSurvey, LoadSurveys, LoadAnswersBySurvey, CheckSurveyById } from '@/domain/usecases'
import { mockSurveyModels } from '@/tests/domain/mocks'
import faker from 'faker'

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurvey.Params

  async add (data: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = data
    return Promise.resolve()
  }
}

export class LoadAnswersBySurveySpy implements LoadAnswersBySurvey {
  result = [
    faker.random.word(),
    faker.random.word()
  ]

  id: string

  async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
    this.id = id
    return Promise.resolve(this.result)
  }
}

export class CheckSurveyByIdSpy implements CheckSurveyById {
  result = true
  id: string

  async checkById (id: string): Promise<CheckSurveyById.Result> {
    this.id = id
    return Promise.resolve(this.result)
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  result = mockSurveyModels()
  accountId: string

  async load (accountId: string): Promise<LoadSurveys.Result> {
    this.accountId = accountId
    return Promise.resolve(this.result)
  }
}
