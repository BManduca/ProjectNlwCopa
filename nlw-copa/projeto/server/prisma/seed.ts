import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Brunno Manduca',
            email: 'brunno@example.com',
            avatarUrl: 'https://github.com/BManduca.png'
        }
    })

    const pool = await prisma.pool.create({
        data: {
            title: 'Example Pool7',
            code: 'BOL975',
            ownerId: user.id, 

            participants: {
                create: {
                    userId: user.id
                }
            }
        }
    })

    //maneira alternativa de criação de registro na tabela participants
    // const participant = await prisma.participant.create({
    //     data: {
    //         poolId: pool.id,
    //         userId: user.id
    //     }
    // })

    await prisma.game.create({
        data: {
            date: '2022-12-21T16:00:00.747Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR'
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-12-15T13:00:00.747Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR',

            guesses: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 1,

                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id
                            }
                        }
                    }                    
                }
            }
        }
    })
}

main()