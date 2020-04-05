import WebSocket from 'isomorphic-ws'
import crypto, { DiffieHellman, Cipher, Decipher } from 'crypto'
import { waitFor, assertDefined } from './lib'
import { EventEmitter } from 'events'
import { AssertionError } from 'assert'

export interface Link {
  secret: Buffer
  uid: string
  cipher: Cipher
  decipher: Decipher
  nick: string | null
}

export interface LinkState {
  next: Link | null
  prev: Link | null
  df: DiffieHellman | null
}

const iv = Buffer.alloc(16, 0)

declare interface CrypticatClient {
  on(event: 'message', listener: (userUid: string, nick: string | null, content: string) => void): this
  on(event: 'close', listener: () => void): this
  on(event: 'error', listener: (error: Error) => void): this

  on(event: 'connect', listener: (uid: string, nick: string | null) => void): this
  on(event: 'disconnect', listener: (uid: string, nick: string | null) => void): this
}

class CrypticatClient extends EventEmitter {
  private linkState: LinkState = {
    next: null,
    prev: null,
    df: null
  }
  private nick: string | null = null
  private ws?: WebSocket

  constructor() { super() }

  async connect(address: string) {
    this.ws = new WebSocket(address)
    await new Promise((resolve, reject) => {
      assertDefined(this.ws)

      const listeners = {
        error: (error: Error) => {
          assertDefined(this.ws)
          this.ws.removeEventListener('open', listeners.open)
          reject(error)
        },
        open: () => {
          assertDefined(this.ws)
          this.ws.removeEventListener('open', listeners.error)
          resolve()
        }
      }

      this.ws.addEventListener('error', listeners.error)
      this.ws.addEventListener('open', listeners.open)
    })

    this.ws.addEventListener('message', (message: { data: string }) => {
      try {
        assertDefined(this.ws)
        const { action, payload } = JSON.parse(message.data)

        switch (action) {
          case 'GENERATE_KEY': {
            assertDefined(payload.prime)

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
            assertDefined(payload.key)
            assertDefined(payload.uid)

            const dir = action === 'PREV_LINK' ? 'prev' : 'next'

            if (action === 'NEXT_LINK' && !this.linkState.next) {
              this.emit('connect', payload.uid, payload.nick ?? null)
              this.sendEncrypted('prev', {
                action: 'CONNECT',
                payload: { uid: payload.uid, nick: payload.nick }
              })
            } else if (this.linkState.next) {
              assertDefined(this.linkState[dir])
              this.emit('disconnect', this.linkState[dir]?.uid, this.linkState[dir]?.nick ?? null)
              this.sendEncrypted(dir === 'prev' ? 'next' : 'prev', {
                action: 'DISCONNECT',
                payload: { uid: this.linkState[dir]?.uid, nick: this.linkState[dir]?.nick }
              })
            }

            assertDefined(this.linkState.df)
            const secret = this.linkState.df.computeSecret(Buffer.from(payload.key, 'hex'))

            this.linkState[dir] = {
              secret,
              cipher: crypto.createCipheriv('aes-256-gcm', secret, iv),
              decipher: crypto.createDecipheriv('aes-256-gcm', secret, iv),
              uid: payload.uid,
              nick: payload.nick
            }

            break
          }

          case 'CLEAR_PREV_LINK':
          case 'CLEAR_NEXT_LINK': {
            const dir = action === 'CLEAR_PREV_LINK' ? 'prev' : 'next'

            this.emit('disconnect', this.linkState[dir]?.uid, this.linkState[dir]?.nick ?? null)
            this.sendEncrypted(dir === 'prev' ? 'next' : 'prev', {
              action: 'DISCONNECT',
              payload: { uid: this.linkState[dir]?.uid, nick: this.linkState[dir]?.nick }
            })

            delete this.linkState[dir]
            break
          }

          case 'ENCRYPTED_PAYLOAD': {
            if (payload.dir !== 'prev' && payload.dir !== 'next') break

            const inverseLink = this.linkState[payload.dir === 'prev' ? 'next' : 'prev']
            assertDefined(inverseLink)

            const decryptedMessage = inverseLink.decipher.update(Buffer.from(payload.encryptedMessage, 'hex'))
            const parsed = JSON.parse(decryptedMessage.toString())

            assertDefined(payload.directFrom)
            const originalFrom = parsed.from ?? payload.directFrom

            {
              const { action, payload } = parsed.message

              switch (action) {
                case 'MESSAGE': {
                  assertDefined(payload.content)
                  this.emit('message', originalFrom, payload.nick, payload.content)
                  if (inverseLink.uid === originalFrom) {
                    inverseLink.nick = payload.nick
                  }
                  break
                }

                case 'CONNECT': {
                  assertDefined(payload.uid)
                  this.emit('connect', payload.uid, payload.nick ?? null)
                  break
                }

                case 'DISCONNECT': {
                  assertDefined(payload.uid)
                  this.emit('disconnect', payload.uid, payload.nick ?? null)
                  break
                }
              }
            }

            const nextDir = payload.dir as 'prev' | 'next'
            if (this.linkState[nextDir]) this.sendEncrypted(nextDir, parsed.message, originalFrom)

            break
          }

          case 'PING': {
            this.ws.send(JSON.stringify({
              action: 'PONG',
              payload: {}
            }))
            break
          }
        }
      } catch (error) {
        this.emit('error', error)
      }
    })

    this.ws.addEventListener('close', () => {
      this.emit('close')
    })
  }

  async joinRoom(name: string) {
    this.assertWs(this.ws)
    this.ws.send(JSON.stringify({
      action: 'JOIN_ROOM',
      payload: { name, nick: this.nick }
    }))

    this.linkState.df = null
    this.linkState.next = null
    this.linkState.prev = null

    await waitFor(this.ws, 'ROOM_READY')
  }

  sendMessage(content: string) {
    this.assertWs(this.ws)

    if (this.linkState.next) {
      this.sendEncrypted('next', {
        action: 'MESSAGE',
        payload: { content, nick: this.nick }
      })
    }

    if (this.linkState.prev) {
      this.sendEncrypted('prev', {
        action: 'MESSAGE',
        payload: { content, nick: this.nick }
      })
    }
  }

  setNick(nick: string | null) {
    this.nick = nick
  }

  getNick() {
    return this.nick
  }

  close() {
    this.assertWs(this.ws)
    this.ws.close()

    this.linkState.df = null
    this.linkState.next = null
    this.linkState.prev = null

    this.nick = null
    this.ws = undefined
  }

  private assertWs(ws?: WebSocket): asserts ws is NonNullable<WebSocket> {
    if (ws?.readyState !== 1) {
      throw new AssertionError({
        message: 'The websocket is not open!',
        expected: 1,
        actual: ws?.readyState
      })
    }
  }

  private sendEncrypted(dir: 'next' | 'prev', message: { action: string, payload: object }, from?: string) {
    this.assertWs(this.ws)

    const link = this.linkState[dir]
    if (!link) return

    this.ws.send(JSON.stringify({
      action: 'DISPATCH_ENCRYPTED',
      payload: {
        recipient: link.uid,
        encryptedMessage: link.cipher.update(JSON.stringify({ message, from })).toString('hex'),
        dir
      }
    }))
  }
}

export { CrypticatClient }