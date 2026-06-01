import Fastify from 'fastify'
import prisma from './lib/prisma'

const app = Fastify({ logger: true })

app.get('/health', async () => {
  return { status: 'ok', projeto: 'Mesa Aberta' }
})

app.get('/test-db', async () => {
  const encontros = await prisma.encounter.findMany()
  return { encontros, total: encontros.length }
})

const PORT = 3001

app.listen({ port: PORT, host: '0.0.0.0' }, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})