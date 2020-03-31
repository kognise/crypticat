import { CrypticatServer } from '@crypticat/core'
import chalk from 'chalk'

const server = new CrypticatServer()

server.on('connect', (uid) => console.log(`${chalk.gray(uid.slice(0, 6))} connected`))
server.on('disconnect', (uid) => console.log(`${chalk.gray(uid.slice(0, 6))} disconnected`))
server.on('join', (uid, room, nick) => console.log(`${chalk.gray(uid.slice(0, 6))} joined ${chalk.cyan(`#${room}`)} as ${chalk.cyan(nick ?? 'unnicked')}`))
server.on('dispatch', (from, to) => console.log(`${from.slice(0, 6)} ${chalk.gray('->')} ${to.slice(0, 6)}`))

export const go = (port: number) => {
  console.log(chalk.green(`Started server on port ${port}`))
  console.log(`Connect with \`${chalk.cyan(`crypticat ws://localhost:${port}`)}\``)
  server.listen(port)
}