import { AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository } from '@/data/protocols'
import { SurveyModel } from '@/domain/models'
import { AddSurveyParams } from '@/domain/usecases'
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams: AddSurveyParams

  async add (surveyData: AddSurveyParams): Promise<void> {
    this.addSurveyParams = surveyData
    return Promise.resolve()
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  surveyModel = mockSurveyModel()
  id: string

  async loadById (id: string): Promise<SurveyModel> {
    this.id = id
    return Promise.resolve(this.surveyModel)
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  surveyModels = mockSurveyModels()
  callsCount = 0

  async loadAll (): Promise<SurveyModel[]> {
    this.callsCount++
    return Promise.resolve(this.surveyModels)
  }
}
