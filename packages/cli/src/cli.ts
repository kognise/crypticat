import pkg from '../package.json'
import checkForUpdate from 'update-check'
import chalk from 'chalk'

const go = async () => {
  const [_, ...args] = process.argv

  if (args[1] === 'serve') {
    const { go } = await import('./server')
    go(parseInt(args[2]) || 8080)
  } else {
    const { go } = await import('./client')
    go(args[1] ?? 'wss://u.kognise.dev')
  }
}

checkForUpdate(pkg).then((update) => {
  if (update) {
    console.log(`${chalk.bgRed.whiteBright('UPDATE AVAILABLE')} The latest version is ${update.latest}`)
  }
}).catch(() => {
  console.log(chalk.red('Unable to check for updates'))
}).then(go)