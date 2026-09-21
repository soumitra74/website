const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const gitHooks = path.join(root, '.git', 'hooks')
if (!fs.existsSync(gitHooks)) process.exit(0)

const srcDir = path.join(root, '.githooks')
for (const name of fs.readdirSync(srcDir)) {
  const dest = path.join(gitHooks, name)
  fs.copyFileSync(path.join(srcDir, name), dest)
  fs.chmodSync(dest, 0o755)
  console.log(`installed git hook: ${name}`)
}
