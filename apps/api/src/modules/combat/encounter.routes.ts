import { FastifyInstance } from 'fastify'
import prisma from '../../lib/prisma'
export async function encounterRoutes(app: FastifyInstance) {

    app.post('/encounters', async (request, reply) => {
        const { name, description } = request.body as { name: string, description?: string }

        const encounter = await prisma.encounter.create({
            data: {
                name,
                description,
            },
        })

        return reply.status(201).send(encounter)
    })

    app.get('/encounters/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    
    const encounter = await prisma.encounter.findUnique({
      where: { id },
      include: { combatants: true },
    })

    if (!encounter) {
      return reply.status(404).send({ error: 'Encontro não encontrado' })
    }
    
    return encounter
  })

}