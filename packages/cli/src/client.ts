/// <reference path="./readline-promise.d.ts" />

import { CrypticatClient } from '@crypticat/core'
import readline from 'readline-promise'
import { cursorTo, clearLine } from 'readline'
import chalk from 'chalk'

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

client.on('message', (nick, content) => print(`${chalk.cyan.bold(nick)} ${content}`))
client.on('disconnect', () => {
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
  await joinRoom('lobby')

  let nick = 'unknown'
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

          const room = args[0].startsWith('#') ? args[0].slice(1) : args[0]
          await joinRoom(room)
          break
        }

        case 'nick': {
          if (!args[0]) {
            nick = 'unknown'
            break
          }

          nick = args.join(' ')
          break
        }
      }

      continue
    }

    client.sendMessage(nick, message)
  }
}