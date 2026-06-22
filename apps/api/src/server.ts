import Fastify from 'fastify'
import cors from '@fastify/cors'
import { encounterRoutes } from './modules/combat/encounter.routes'

const app = Fastify({ logger: true })

async function main() {
  await app.register(cors, {
    origin: 'http://localhost:3000',
  })

  app.get('/health', async () => {
    return { status: 'ok', projeto: 'Mesa Aberta' }
  })

  await app.register(encounterRoutes)

  await app.listen({ port: 3001, host: '0.0.0.0' })
  console.log('Servidor rodando em http://localhost:3001')
}

main()