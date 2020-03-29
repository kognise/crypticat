declare module 'readline-promise' {
  interface RLP {
    questionAsync: (text: string) => string
  }

  interface Export {
    createInterface: (thing: {
      input: NodeJS.ReadableStream,
      output?: NodeJS.ReadableStream,
      terminal: boolean
    }) => RLP
  }

  const main: Export
  export = main
}