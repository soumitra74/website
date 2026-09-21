import fs from 'fs'
import { metricsDir } from './record'

export default async function globalSetup() {
  fs.rmSync(metricsDir, { recursive: true, force: true })
}
