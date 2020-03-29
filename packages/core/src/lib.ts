import { AssertionError } from 'assert'
import WebSocket from 'isomorphic-ws'

export const waitFor = <T>(ws: WebSocket, wantedAction: string) => new Promise<T>((resolve) => {
  const listener = (message: string) => {
    const { action, payload } = JSON.parse(message)

    if (action === wantedAction) {
      ws.off('message', listener)
      resolve(payload as T)
    }
  }

  ws.on('message', listener)
})

export function assertDefined<T>(thing: T): asserts thing is NonNullable<T> {
  if (thing === null || thing === undefined) {
    throw new AssertionError({ message: `Expected 'thing' to be defined, but received ${thing}` })
  }
}