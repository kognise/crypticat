import svgr from '@svgr/core'
import fs from 'fs-extra'
import fetch from 'isomorphic-unfetch'
import chalk from 'chalk'
import camelCase from 'camelcase'

const repo = 'ionic-team/ionicons'
const directory = 'src/svg/'
const out = 'components/'

const listingApi = `https://api.github.com/repos/${repo}/contents/${directory}`
const rawPrefix = `https://raw.githubusercontent.com/${repo}/master/${directory}`

const go = async () => {
  await fs.emptyDir(out)

  console.log(chalk.yellow('Fetching files...'))
  const res = await fetch(listingApi)
  const files = await res.json()
  const svgs = files.map(({ name }) => name).filter((name) => name.endsWith('.svg')).map((name) => name.slice(0, -4))

  for (let svg of svgs) {
    console.log(`Converting ${chalk.cyan(svg)} to a React component`)
    const res2 = await fetch(`${rawPrefix}${svg}.svg`)
    const source = await res2.text()
    const js = await svgr(source, {
      plugins: [
        '@svgr/plugin-jsx',
        '@svgr/plugin-prettier'
      ],
      icon: true,
      typescript: true
    }, { componentName: camelCase(svg, { pascalCase: true }) })
    await fs.writeFile(`${out}${svg}.tsx`, js.replace(/#000(000)?/g, 'currentColor'))
  }

  console.log(chalk.yellow('Writing main file...'))
  await fs.writeFile(`${out}ionicons.tsx`, `
import * as React from 'react'

export default () => (
  <div>
    Please import individual files, for example <code>import AddCircleOutlineIcon from '@crypticat/add-circle-outline'</code>.
  </div>
)
  `.trim())

  console.log(chalk.green('Done!'))
}

go()