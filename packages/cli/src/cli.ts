const [_, ...args] = process.argv

if (args[1] === 'server') {
  import('./server')
} else {
  import('./client').then(({ go }) => go(args[1] ?? 'ws://localhost:8080'))
}