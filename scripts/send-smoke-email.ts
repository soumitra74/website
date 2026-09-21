import { spawnSync } from 'child_process'
import { runSmokeEmailCli } from '../src/lib/smoke-email'

function runSmokeTests() {
  const result = spawnSync('npm', ['run', 'test:smoke'], {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  })
  if (result.error) throw result.error
}

runSmokeEmailCli(process.env, { runSmokeTests }).catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
