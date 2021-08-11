import swaggerConfig from '@/main/docs'
import { noCache } from '@/main/middlewares'
import { Express, Request, Response } from 'express'
import { serve, setup } from 'swagger-ui-express'

export default (app: Express): void => {
  app.get('/',(request: Request, response: Response) => {
    response.redirect('/api-docs')
  })
  app.use('/api-docs',noCache, serve, setup(swaggerConfig))
}
