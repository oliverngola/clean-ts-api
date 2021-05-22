import paths from './paths'
import schemas from './schemas'
import components from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API para realizar enquetes entre programadores',
    version: '1.0.1',
    contact: {
      name: 'Oliveira Ngola',
      email: 'oliveiraernestongola123@gmail.com',
      url: 'https://www.linkedin.com/in/oliveira-ngola-8067b51ab/'
    },
    license: {
      name: 'GPL-3.0-or-later',
      url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
    }
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
    name: 'Login',
    description: 'APIs relacionadas a Login'
  }, {
    name: 'Enquete',
    description: 'APIs relacionadas a Enquete'
  }],
  paths,
  schemas,
  components
}
