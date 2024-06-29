//Arquivo para testar a conexão com o banco de dados


const { PrismaClient } = require( '@prisma/client')
const prisma = new PrismaClient()

async function main() {
    await prisma.user.create({
        data: {
            name: 'Alice',
            email: 'teste@gmail.com',
            password: '123456'
        }
    });

    const allUsers = await prisma.user.findMany()
    console.log(allUsers)
    await prisma.user.delete({
        where: {
            email: 'teste@gmail.com'
        }});
    const allUsers2 = await prisma.user.findMany()
    console.log(allUsers2)
}

main().catch(e => {
    console.error(e)
}).finally(async () => {
    await prisma.$disconnect()
});