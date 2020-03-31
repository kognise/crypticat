# Crypticat Core

This is crypticat's core client and server implementation that you can use to write your own client or host your own server programmatically!

Since I didn't have a lot of time, the documentation will be in the form of a code showing off all the possible functions. I purposefully kept the scope of this library small, if you want more customization feel free to write a custom client by reading the source code.

You might be looking for the [main documentation.](https://github.com/kognise/crypticat/blob/master/README.md)

## Client

```typescript
import { CrypticatClient } from '@crypticat/core'

const client = new CrypticatClient()

client.on('message', (userUid, nick, content) => {
  console.log(`${nick || 'unnicked'} (${userUid}) sent a message: ${content}`)
})
client.on('connect', (uid, nick) => `${nick || unnicked} (${uid}) joined`)
client.on('disconnect', (uid, nick) => `${nick || unnicked} (${uid}) left`)
client.on('error', (error) => console.error('error'))
client.on('close', () => console.error('Connection lost!'))

client.setNick('your nickname')
client.getNick() // 'your nickname'

await client.connect('wss://u.kognise.dev/')
await client.joinRoom('test')
client.sendMessage('Hello, world!')
```

## Server

```typescript
import { CrypticatServer } from '@crypticat/server'

const server = new CrypticatServer()

server.on('connect', (uid) => console.log(`${uid} connected`))
server.on('disconnect', (uid) => console.log(`${uid} disconnected`))
server.on('join', (uid, room, nick) => console.log(`${uid} joined #${room} as ${nick || 'unnicked'}`))
server.on('dispatch', (fromUid, toUid) => console.log(`dispatcing ${fromUid} -> ${toUid}`))

// listen can also take an http or https server instance
server.listen(8080)
```

