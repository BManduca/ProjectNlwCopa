import Fastify from "fastify";
import cors from "@fastify/cors";

import { poolRoutes } from "./routes/pool";
import { authRoutes } from "./routes/auth";
import { gameRoutes } from "./routes/game";
import { guessRoutes } from "./routes/guess";
import { userRoutes } from "./routes/user";


//primeira function executada pelo nosso código
async function bootstrap() {
    //ficará 'colocando' logs para monitora tudo que esta acontecendo
    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        //permite qualquer aplicação acessar nosso backend
        origin: true
    })

    await fastify.register(poolRoutes)
    await fastify.register(authRoutes)
    await fastify.register(gameRoutes)
    await fastify.register(guessRoutes)
    await fastify.register(userRoutes)

    //host para ajudar a executar e funcionar a parte mobile no android 
    await fastify.listen({ port: 3333, /* host: '0.0.0.0'*/ })

}

bootstrap()