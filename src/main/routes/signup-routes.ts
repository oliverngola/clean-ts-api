import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', (request, response) => {
    return response.json({
      message: 'You find me'
    })
  })
}
