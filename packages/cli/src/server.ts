import { CrypticatServer } from '@crypticat/core'
import chalk from 'chalk'

const server = new CrypticatServer()

server.on('connect', (uid) => console.log(`${chalk.gray(uid.slice(0, 6))} connected`))
server.on('disconnect', (uid) => console.log(`${chalk.gray(uid.slice(0, 6))} disconnected`))
server.on('join', (uid, room) => console.log(`${chalk.gray(uid.slice(0, 6))} joined ${chalk.cyan(`#${room}`)}`))
server.on('dispatch', (from, to) => console.log(`${from.slice(0, 6)} ${chalk.gray('->')} ${to.slice(0, 6)}`))

server.listen(8080)