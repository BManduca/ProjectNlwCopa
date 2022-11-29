import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Stuart potter',
            email: 'stuart@prisma.com',
            avatrUrl: 'https://github.com/BManduca.png'
        }
    })

    const pool = await prisma.pool.create({
        data: {
            title: 'Example Pool6',
            code: 'BOL4532',
            ownerId: user.id, 

            participants: {
                create: {
                    userId: user.id
                }
            }
        }
    })

    // const participant = await prisma.participant.create({
    //     data: {
    //         poolId: pool.id,
    //         userId: user.id
    //     }
    // })

    await prisma.game.create({
        data: {
            date: '2022-11-18T16:00:00.747Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR'
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-20T13:00:00.747Z',
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