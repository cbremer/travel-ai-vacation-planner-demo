import { copyFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const projectRoot = resolve(import.meta.dirname, '..')
const distRoot = resolve(projectRoot, 'dist')

await mkdir(resolve(distRoot, 'assets'), { recursive: true })

const copies = [
  ['site/index.html', 'index.html'],
  ['site/site.css', 'site.css'],
  ['site/sw.js', 'sw.js'],
  ['public/favicon.svg', 'favicon.svg'],
  ['output/playwright/home-mobile.png', 'assets/home-mobile.png'],
  ['output/playwright/day-mobile.png', 'assets/day-mobile.png'],
  ['output/playwright/trip-info-mobile.png', 'assets/trip-info-mobile.png'],
]

await Promise.all(
  copies.map(([from, to]) =>
    copyFile(resolve(projectRoot, from), resolve(distRoot, to)),
  ),
)
