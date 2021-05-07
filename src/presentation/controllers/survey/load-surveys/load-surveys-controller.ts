import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveys
} from './load-surveys-controller-protocols'
import {
  notContent,
  ok,
  serverError
} from '../../../helpers/http/http-helpers'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      return surveys.length ? ok(surveys) : notContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
