import {
  accountSchema,
  loginParamsSchema,
  signUpParamsSchema,
  errorSchema,
  surveySchema,
  surveyAnswerSchema,
  surveysSchema,
  addSurveyParamsSchema
} from './schemas/'

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  error: errorSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  surveys: surveysSchema,
  addSurveyParams: addSurveyParamsSchema
}
