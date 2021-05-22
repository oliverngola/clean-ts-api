import {
  accountSchema,
  loginParamsSchema,
  errorSchema,
  surveySchema,
  surveyAnswerSchema,
  surveysSchema
} from './schemas/'

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  error: errorSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  surveys: surveysSchema
}
