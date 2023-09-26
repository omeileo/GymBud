// External Dependencies
const execSync = require('child_process').execSync
const fs = require('fs')

const environment = process.argv[2]
const envFileContent = require(`../../networkRequests/environmentVariables/${environment}.json`)

fs.writeFileSync(
  './src/networkRequests/environmentVariables/env.json',
  JSON.stringify(envFileContent, undefined, 2),
)

execSync('npm run copy-env-file-to-android')
