const fs = require('fs')
const path = require('path')

const androidPath = path.join(__dirname, '../../..', 'android')
const androidFilePath = path.join(androidPath, 'gradle.properties')

const iosPath = path.join(__dirname, '../../..', 'ios')
const iosPodfilePath = path.join(iosPath, 'Podfile')

/**
 * Configure the hermes flag in the Podfile and the gradle.properties files to be true
 */
function updatePodfileAndGradle() {
  // Update gradle.properties
  fs.readFile(androidFilePath, 'utf8', (err, androidData) => {
    if (err) {
      console.log('ERROR: Error reading gradle.properties | ', err)
      
      return
    }

    // Update hermesEnabled
    androidData = androidData.replace(/hermesEnabled\s*=\s*false/, 'hermesEnabled=true')

    // Write the updated content back to gradle.properties
    fs.writeFile(androidFilePath, androidData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.log('ERROR: Error writing to gradle.properties | ', writeErr)
      } else {
        console.log('hermesEnabled updated to true in gradle.properties successfully.')
      }
    })
  })

  // Update Podfile
  fs.readFile(iosPodfilePath, 'utf8', (err, iosData) => {
    if (err) {
      console.log('ERROR: Error reading Podfile | ', err)
      
      return
    }

    // Update hermes_enabled
    iosData = iosData.replace(/:hermes_enabled\s*=>\s*false/, ':hermes_enabled => true')

    // Write the updated content back to Podfile
    fs.writeFile(iosPodfilePath, iosData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.log('ERROR: Error writing to Podfile | ', writeErr)
      } else {
        console.log('hermes_enabled updated to true in Podfile successfully.')
      }
    })
  })
}

// Call the function to update both files
updatePodfileAndGradle()
