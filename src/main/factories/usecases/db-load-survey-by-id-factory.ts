import { DbLoadSurveyById } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra/db'

export const makeDbLoadSurveyById = (): DbLoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyMongoRepository)
}
