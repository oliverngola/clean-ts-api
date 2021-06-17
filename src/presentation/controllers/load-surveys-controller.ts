import { Controller, HttpResponse, HttpRequest } from '@/presentation/protocols'
import { ok, serverError,notContent } from '@/presentation/helpers'
import { LoadSurveys } from '@/domain/usecases'

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
