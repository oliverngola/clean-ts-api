import { DbCheckSurveyById } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra/db'

export const makeDbCheckSurveyById = (): DbCheckSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbCheckSurveyById(surveyMongoRepository)
}
