/// <reference path="./readline-promise.d.ts" />

import { CrypticatClient } from '@crypticat/core'
import readline from 'readline-promise'
import { cursorTo, clearLine } from 'readline'
import chalk from 'chalk'
import Conf from 'conf'

const config = new Conf({ projectName: 'crypticat' })

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
})

const prompt = chalk.yellow.bold('you ')
let listeningForInput = false

const print = (content: string) => {
  if (listeningForInput) {
    cursorTo(process.stdout, 0)
    clearLine(process.stdout, 1)
    console.log(content)
    process.stdout.write(prompt)
  } else {
    console.log(content)
  }
}

const input = async () => {
  listeningForInput = true
  const res = await rl.questionAsync(prompt)
  listeningForInput = false
  return res
}

const client = new CrypticatClient()

client.on('connect', (_, nick) => print(chalk.bold(`${nick ?? 'someone'} joined the room`)))
client.on('disconnect', (_, nick) => print(chalk.bold(`${nick ?? 'someone'} left the room`)))
client.on('error', (error) => chalk.red(`Error: ${error}`))

client.on('message', (_, nick, content) => print(`${chalk.cyan.bold(nick ?? 'unnicked')} ${content}`))
client.on('close', () => {
  print(chalk.red('Connection lost!'))
  process.exit()
})

const joinRoom = async (name: string) => {
  print(chalk.gray(`Joining #${name} securely...`))
  await client.joinRoom(name)
}

export const go = async (address: string) => {
  try {
    await client.connect(address)
  } catch (error) {
    print(chalk.red(`Error connecting: ${error.message}`))
    process.exit(1)
  }

  print(chalk.green('Connection established!'))
  client.setNick(config.get('nickname', null))

  print('')
  await joinRoom('lobby')

  if (client.getNick()) {
    print(`Your nickname is currently ${chalk.cyan(client.getNick())}`)
  } else {
    print(`Please set a nickname with \`${chalk.cyan('/nick <nickname>')}\``)
  }

  while (true) {
    const message = await input()

    if (message.startsWith('/')) {
      const [command, ...args] = message.slice(1).trim().split(/\s+/g)

      switch (command) {
        case 'help': {
          print(chalk.bold('Available commands:'))
          print('join, nick')
          break
        }

        case 'join': {
          if (!args[0]) {
            print(chalk.red('No room specified'))
            break
          }

          print('')
          const room = args[0].startsWith('#') ? args[0].slice(1) : args[0]
          await joinRoom(room)
          break
        }

        case 'nick': {
          if (!args[0]) {
            client.setNick(null)
            config.delete('nickname')
            print(chalk.green('Reset nickname'))
            break
          }

          client.setNick(args.join(' '))
          config.set('nickname', client.getNick())
          print(chalk.green(`Updated nickname to ${client.getNick()}`))
          break
        }
      }

      continue
    }

    client.sendMessage(message)
  }
}