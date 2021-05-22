import { loginPath } from './paths'
import {
  accountSchema,
  loginParamsSchema
} from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API para realizar enquetes entre programadores',
    version: '1.0.1'
  },
  servers: [{
    url: '/api',
    description: 'Development server'
  },
  {
    url: ' https://clean-node-api-ongola.herokuapp.com/api',
    description: 'Production server'
  }],
  tags: [{
    name: 'Login'
  }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema
  }
}
