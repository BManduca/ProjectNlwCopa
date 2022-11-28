import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod"
import ShortUniqueId from "short-unique-id"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: ['query']
})

//primeira function executada pelo nosso codigo
async function bootstratp() {
    //ficará 'colocando' logs para monitoramento de tudo que esta acontecendo
    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        //permite qualquer aplicação acessar nosso backend
        origin: true
    })

    fastify.get('/pools/count', async () => {
        const count = await prisma.pool.count()

        return { count }
    })

    fastify.get('/users/count', async () => {
        const count = await prisma.user.count()

        return { count }
    })

    fastify.get('/guesses/count', async () => {
        const count = await prisma.guess.count()

        return { count }
    })

    fastify.post('/pools', async (request, reply) => {
        // o corpo da requisição é um objeto e dentro dele tem os params
        // e ao utilizar o z.object(), automaticamente o nullable é vetado, ou seja, não é aceito.
        const createPoolBody = z.object({
            title: z.string()
        })

        const { title } = createPoolBody.parse(request.body);

        const generate = new ShortUniqueId({ length: 6 });

        const code = String(generate()).toUpperCase();

        await prisma.pool.create({
            data: {
                title,
                code
            }
        })

        return reply.status(201).send({ code })
    })

    //host para ajudar a executar e funcionar a parte mobile no android 
    await fastify.listen({ port: 3333, /* host: '0.0.0.0'*/ })

}

bootstratp()