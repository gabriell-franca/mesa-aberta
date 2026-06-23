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

    // Listar todos os encontros
    app.get('/encounters/list', async () => {
        const encounters = await prisma.encounter.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return encounters
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


    // Remover combatente do encontro
    app.delete('/encounters/:id/combatants/:combatantId', async (request, reply) => {
        const { combatantId } = request.params as { id: string; combatantId: string }
        await prisma.combatant.delete({ where: { id: combatantId } })
        return reply.status(204).send()
    })

    // Iniciar o combate
    app.post('/encounters/:id/start', async (request, reply) => {
        const { id } = request.params as { id: string }

        const encounter = await prisma.encounter.findUnique({
            where: { id },
            include: { combatants: true },
        })

        if (!encounter) {
            return reply.status(404).send({ error: 'Encontro não encontrado' })
        }

        if (encounter.status === 'ACTIVE') {
            return reply.status(400).send({ error: 'Combate já está em andamento' })
        }

        if (encounter.combatants.length === 0) {
            return reply.status(400).send({ error: 'Adicione combatentes antes de iniciar' })
        }

        // Ordena por iniciativa — maior vai primeiro
        const ordenados = encounter.combatants.sort(
            (a, b) => b.initiative - a.initiative
        )

        const atualizado = await prisma.encounter.update({
            where: { id },
            data: {
                status: 'ACTIVE',
                round: 1,
                activeCombatantId: ordenados[0].id,
            },
            include: { combatants: true },
        })



        return atualizado
    })

    // Salvar recursos/notas do combatente
    app.patch('/encounters/:id/combatants/:combatantId/notes', async (request, reply) => {
        const { combatantId } = request.params as { id: string; combatantId: string }
        const { notes } = request.body as { notes: string }
        const updated = await prisma.combatant.update({
            where: { id: combatantId },
            data: { notes },
        })
        return updated
    })


    // Pausar combate (ACTIVE → IDLE, mantém tudo)
    app.post('/encounters/:id/pause', async (request, reply) => {
        const { id } = request.params as { id: string }
        const updated = await prisma.encounter.update({
            where: { id },
            data: { status: 'IDLE' },
            include: { combatants: true },
        })
        return updated
    })

    // Reiniciar rodadas (zera rodadas, mantém combatentes)
    app.post('/encounters/:id/restart', async (request, reply) => {
        const { id } = request.params as { id: string }
        const updated = await prisma.encounter.update({
            where: { id },
            data: { status: 'IDLE', round: 0, activeCombatantId: null },
            include: { combatants: true },
        })
        return updated
    })

    // Passar para o próximo turno
    app.post('/encounters/:id/next-turn', async (request, reply) => {
        const { id } = request.params as { id: string }

        const encounter = await prisma.encounter.findUnique({
            where: { id },
            include: { combatants: true },
        })

        if (!encounter) {
            return reply.status(404).send({ error: 'Encontro não encontrado' })
        }

        if (encounter.status !== 'ACTIVE') {
            return reply.status(400).send({ error: 'Combate não está em andamento' })
        }

        // Ordena por iniciativa — mesma lógica do /start
        const ordenados = encounter.combatants.sort(
            (a, b) => b.initiative - a.initiative
        )

        // Acha a posição do combatente atual na lista
        const indexAtual = ordenados.findIndex(
            (c) => c.id === encounter.activeCombatantId
        )

        const ehUltimo = indexAtual === ordenados.length - 1

        const atualizado = await prisma.encounter.update({
            where: { id },
            data: {
                // Se era o último, volta pro primeiro e incrementa a rodada
                // Se não, só avança um
                activeCombatantId: ehUltimo
                    ? ordenados[0].id
                    : ordenados[indexAtual + 1].id,
                round: ehUltimo ? encounter.round + 1 : encounter.round,
            },
            include: { combatants: true },
        })

        return atualizado
    })

    // Aplicar dano ou cura num combatente
    app.patch('/encounters/:id/combatants/:combatantId/hp', async (request, reply) => {
        const { combatantId } = request.params as { id: string; combatantId: string }
        const { valor, tipo } = request.body as {
            valor: number
            tipo: 'dano' | 'cura' | 'temp'
        }

        const combatant = await prisma.combatant.findUnique({
            where: { id: combatantId },
        })

        if (!combatant) {
            return reply.status(404).send({ error: 'Combatente não encontrado' })
        }

        let novoHpCurrent = combatant.hpCurrent
        let novoHpTemp = combatant.hpTemp

        if (tipo === 'dano') {
            // Dano consome HP temporário primeiro
            if (novoHpTemp > 0) {
                if (novoHpTemp >= valor) {
                    novoHpTemp -= valor
                } else {
                    const restante = valor - novoHpTemp
                    novoHpTemp = 0
                    novoHpCurrent = Math.max(0, novoHpCurrent - restante)
                }
            } else {
                novoHpCurrent = Math.max(0, novoHpCurrent - valor)
            }
        }

        if (tipo === 'cura') {
            // Cura não ultrapassa o HP máximo
            novoHpCurrent = Math.min(combatant.hpMax, novoHpCurrent + valor)
        }

        if (tipo === 'temp') {
            // HP temporário não acumula — fica com o maior valor
            novoHpTemp = Math.max(novoHpTemp, valor)
        }

        const atualizado = await prisma.combatant.update({
            where: { id: combatantId },
            data: {
                hpCurrent: novoHpCurrent,
                hpTemp: novoHpTemp,
            },
        })

        return atualizado
    })

    // Atualizar exaustão e condições de um combatente
    app.patch('/encounters/:id/combatants/:combatantId/status', async (request, reply) => {
        const { combatantId } = request.params as { id: string; combatantId: string }
        const { exhaustionLevel, conditions } = request.body as {
            exhaustionLevel?: number
            conditions?: string[]
        }

        const combatant = await prisma.combatant.findUnique({
            where: { id: combatantId },
        })

        if (!combatant) {
            return reply.status(404).send({ error: 'Combatente não encontrado' })
        }

        // Exaustão fica entre 0 e 6
        const novaExaustao = exhaustionLevel !== undefined
            ? Math.min(6, Math.max(0, exhaustionLevel))
            : combatant.exhaustionLevel

        const atualizado = await prisma.combatant.update({
            where: { id: combatantId },
            data: {
                exhaustionLevel: novaExaustao,
                conditions: conditions ?? combatant.conditions,
            },
        })

        return atualizado
    })

    // Encerrar o combate
    app.post('/encounters/:id/end', async (request, reply) => {
        const { id } = request.params as { id: string }

        const encounter = await prisma.encounter.findUnique({
            where: { id },
        })

        if (!encounter) {
            return reply.status(404).send({ error: 'Encontro não encontrado' })
        }

        if (encounter.status !== 'ACTIVE') {
            return reply.status(400).send({ error: 'Combate não está em andamento' })
        }

        const atualizado = await prisma.encounter.update({
            where: { id },
            data: {
                status: 'IDLE',
                activeCombatantId: null,
            },
            include: { combatants: true },
        })

        return atualizado
    })

}