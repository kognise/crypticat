import dotenv from 'dotenv'
dotenv.config()

import svgr from '@svgr/core'
import fs from 'fs-extra'
import fetch from 'isomorphic-unfetch'
import chalk from 'chalk'
import camelCase from 'camelcase'

const out = 'components/'

const go = async () => {
  await fs.emptyDir(out)

  console.log(chalk.yellow('Fetching files...'))
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
    },
    body: JSON.stringify({
      query: /* GraphQL */ `
        query { 
          repository(name: "ionicons", owner: "ionic-team") {
            object(expression: "master:src/svg") {
              ... on Tree {
                entries {
                  name
                  object {
                    ... on Blob {
                      text
                    }
                  }
                }
              }
            }
          }
        }
      `
    })
  })
  const json = await res.json()

  for (let file of json.data.repository.object.entries) {
    if (!file.name.endsWith('.svg')) continue
    const svg = file.name.slice(0, -4)

    console.log(`Converting ${chalk.cyan(svg)} to a React component`)

    const js = await svgr(file.object.text, {
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
    Please import individual files, for example <code>import AddCircleOutlineIcon from '@crypticat/ionicons/lib/add-circle-outline'</code>.
  </div>
)
  `.trim())

  console.log(chalk.green('Done!'))
}

if (process.env.GITHUB_TOKEN) {
  go()
} else {
  console.log(chalk.red('Please set the GITHUB_TOKEN environment variable!'))
}