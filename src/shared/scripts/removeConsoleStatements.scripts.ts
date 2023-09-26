const fs = require('fs')
const path = require('path')

function getAllFiles(dirPath, excludePaths = [], fileArray = []) {
  const files = fs.readdirSync(dirPath)

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      if (!excludePaths.some((excludePath) => filePath.includes(excludePath))) {
        getAllFiles(filePath, excludePaths, fileArray)
      }
    } else {
      fileArray.push(filePath)
    }
  }

  return fileArray
}

/**
 * Removes console statements from all JS and TS files to improve app performance.
 * @param filePath 
 */
function removeConsoleStatements(filePath) {
  let fileContent = fs.readFileSync(filePath, 'utf8')

  // fileContent = fileContent.replace(/console\.(log|warn|error|info|debug)\(.+?\);?/g, '')
  fileContent = fileContent.replace(/console\.(log|warn|error|info|debug)\(.*\);?/g, '')

  fs.writeFileSync(filePath, fileContent)
}

const projectDirectory = process.cwd()
const pathsToExclude = []

const allFiles = getAllFiles(`${projectDirectory}/src`, pathsToExclude).filter(
  (file) => file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.jsx')
)

allFiles.forEach((file) => {
  removeConsoleStatements(file)
})

