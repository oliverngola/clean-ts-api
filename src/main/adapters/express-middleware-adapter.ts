import { Middleware } from '@/presentation/protocols'
import { Request, Response, NextFunction } from 'express'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const req = {
      accessToken: request.headers?.['x-access-token'],
      ...(request.headers || {})
    }
    const httpResponse = await middleware.handle(req)
    if (httpResponse.statusCode === 200) {
      Object.assign(request, httpResponse.body)
      next()
    } else {
      response.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
