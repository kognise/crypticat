import WebSocket from 'ws'
import crypto, { DiffieHellman, Cipher, Decipher } from 'crypto'
import { waitFor, assertDefined } from './lib'
import { EventEmitter } from 'events'
import { AssertionError } from 'assert'

export interface Link {
  secret: Buffer
  uid: string
  cipher: Cipher
  decipher: Decipher
}

export interface LinkState {
  next: Link | null
  prev: Link | null
  df: DiffieHellman | null
}

const iv = Buffer.alloc(16, 0)

declare interface CrypticatClient {
  on(event: 'message', listener: (nick: string, content: string) => void): this
  on(event: 'disconnect', listener: () => void): this
}

class CrypticatClient extends EventEmitter {
  linkState: LinkState = {
    next: null,
    prev: null,
    df: null
  }
  room: string | null = null
  ws?: WebSocket

  constructor() { super() }

  async connect(address: string) {
    this.ws = new WebSocket(address)
    await new Promise((resolve, reject) => {
      assertDefined(this.ws)

      const listeners = {
        error: (error: Error) => {
          assertDefined(this.ws)
          this.ws.off('open', listeners.open)
          reject(error)
        },
        open: () => {
          assertDefined(this.ws)
          this.ws.off('open', listeners.error)
          resolve()
        }
      }

      this.ws.once('error', listeners.error)
      this.ws.once('open', listeners.open)
    })

    this.ws.on('message', (message: string) => {
      assertDefined(this.ws)
      const { action, payload } = JSON.parse(message)

      switch (action) {
        case 'GENERATE_KEY': {
          this.linkState.df = crypto.createDiffieHellman(Buffer.from(payload.prime, 'hex'))
          const key = this.linkState.df.generateKeys()
          this.ws.send(JSON.stringify({
            action: 'KEY',
            payload: {
              key: key.toString('hex')
            }
          }))
          break
        }

        case 'PREV_LINK':
        case 'NEXT_LINK': {
          const dir = action === 'PREV_LINK' ? 'prev' : 'next'

          assertDefined(this.linkState.df)
          const secret = this.linkState.df.computeSecret(Buffer.from(payload.key, 'hex'))

          this.linkState[dir] = {
            secret,
            cipher: crypto.createCipheriv('aes-256-gcm', secret, iv),
            decipher: crypto.createDecipheriv('aes-256-gcm', secret, iv),
            uid: payload.uid
          }

          break
        }

        case 'CLEAR_PREV_LINK':
        case 'CLEAR_NEXT_LINK': {
          const dir = action === 'CLEAR_PREV_LINK' ? 'prev' : 'next'
          delete this.linkState[dir]
          break
        }

        case 'ENCRYPTED_PAYLOAD': {
          if (payload.dir !== 'prev' && payload.dir !== 'next') break

          const inverseLink = this.linkState[payload.dir === 'prev' ? 'next' : 'prev']
          assertDefined(inverseLink)

          const decryptedMessage = inverseLink.decipher.update(Buffer.from(payload.encryptedMessage, 'hex'))
          const parsed = JSON.parse(decryptedMessage.toString())

          {
            const { action, payload } = parsed

            switch (action) {
              case 'MESSAGE': {
                this.emit('message', payload.nick, payload.content)
                break
              }
            }
          }

          const nextDir = payload.dir as 'prev' | 'next'
          if (this.linkState[nextDir]) this.sendEncrypted(nextDir, parsed)

          break
        }
      }
    })

    this.ws.on('close', () => this.emit('disconnect'))
  }

  sendEncrypted(dir: 'next' | 'prev', message: { action: string, payload: object }) {
    this.assertWs(this.ws)

    const link = this.linkState[dir]
    assertDefined(link)

    this.ws.send(JSON.stringify({
      action: 'DISPATCH_ENCRYPTED',
      payload: {
        recipient: link.uid,
        encryptedMessage: link.cipher.update(JSON.stringify(message)).toString('hex'),
        dir
      }
    }))
  }

  async joinRoom(name: string) {
    this.assertWs(this.ws)
    this.ws.send(JSON.stringify({
      action: 'JOIN_ROOM',
      payload: { name }
    }))

    this.linkState.df = null
    this.linkState.next = null
    this.linkState.prev = null

    await waitFor(this.ws, 'ROOM_READY')
    this.room = name
  }

  sendMessage(nick: string, content: string) {
    this.assertWs(this.ws)

    if (this.linkState.next) {
      this.sendEncrypted('next', {
        action: 'MESSAGE',
        payload: { content, nick }
      })
    }

    if (this.linkState.prev) {
      this.sendEncrypted('prev', {
        action: 'MESSAGE',
        payload: { content, nick }
      })
    }
  }

  private assertWs(ws?: WebSocket): asserts ws is NonNullable<WebSocket> {
    if (ws === undefined || ws.readyState !== 1) {
      throw new AssertionError({ message: 'The websocket is not open!' })
    }
  }
}

export { CrypticatClient }