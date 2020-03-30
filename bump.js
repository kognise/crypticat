const prompts = require('prompts')
const fs = require('fs-extra')
const semver = require('semver')
const chalk = require('chalk')
const execa = require('execa')

;(async () => {
  const packages = await fs.readdir('packages/')

  const { package } = await prompts({
    type: 'select',
    message: 'Which package?',
    name: 'package',
    choices: packages.map((name) => ({ name, value: name }))
  })
  if (!package) return

  const json = await fs.readJson(`packages/${package}/package.json`)
  console.log(`Current version is ${chalk.cyan(json.version)}`)

  const { version } = await prompts({
    type: 'text',
    message: 'What version?',
    name: 'version',
    validate: (version) => {
      if (!semver.valid(version)) return `That isn't a valid version`
      if (!semver.gt(version, json.version)) return 'The new version must be greater than the old version'
      return true
    }
  })
  if (!version) return
 
  console.log(chalk.yellow('Publishing...'))
  await execa('yarn', [ 'workspace', json.name, 'version', '--new-version', version, '--no-git-tag-version' ])
  await execa('yarn', [ 'workspace', json.name, 'publish', '--new-version', version ])
  console.log(chalk.green('Done!'))
})()