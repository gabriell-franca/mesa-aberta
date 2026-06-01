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

    // Adicionar combatente ao encontro
    app.post('/encounters/:id/combatants', async (request, reply) => {
        const { id } = request.params as { id: string }
        const { name, initiative, hpMax, ac, isPlayer } = request.body as {
            name: string
            initiative: number
            hpMax: number
            ac: number
            isPlayer?: boolean
        }

        // Verifica se o encontro existe
        const encounter = await prisma.encounter.findUnique({
            where: { id },
        })

        if (!encounter) {
            return reply.status(404).send({ error: 'Encontro não encontrado' })
        }

        const combatant = await prisma.combatant.create({
            data: {
                encounterId: id,
                name,
                initiative,
                hpMax,
                hpCurrent: hpMax,
                ac,
                isPlayer: isPlayer ?? false,
                conditions: [],
            },
        })

        return reply.status(201).send(combatant)
    })

}