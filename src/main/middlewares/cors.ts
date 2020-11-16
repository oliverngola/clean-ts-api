import { Request, Response, NextFunction } from 'express'

export const cors = (request: Request, response: Response, next: NextFunction): void => {
  response.set('access-origin-allow-control', '*')
  response.set('access-origin-allow-methods', '*')
  response.set('access-origin-allow-headers', '*')
  next()
}
