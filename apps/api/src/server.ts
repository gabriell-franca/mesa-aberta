import Fastify from 'fastify'

const app = Fastify({ logger: true })

app.get('/health', async () => {
  return { status: 'ok', projeto: 'Mesa Aberta' }
})

const PORT = 3001

app.listen({ port: PORT, host: '0.0.0.0' }, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})