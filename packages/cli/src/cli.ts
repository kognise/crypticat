const [_, ...args] = process.argv

if (args[1] === 'serve') {
  import('./server').then(({ go }) => go(parseInt(args[2]) || 8080))
} else {
  import('./client').then(({ go }) => go(args[1] ?? 'ws://localhost:8080'))
}