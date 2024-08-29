const slip39 = require('slip39')
// threshold (N) number of group-shares required to reconstruct the master secret.
const groupThreshold = 4
const hexSecret = 'c4b6d998c265c56c983731676ea732e4'
const passphrase = ''
const isoTimestamp = new Date().toISOString()
const title = `TomF SSSS Offline Slip39 Example - ${isoTimestamp}`

const groups = [
  [1, 1, 'Home'],
  [1, 1, 'Work'],
  [1, 1, 'Austin Bank'],
  [1, 1, 'San Antonio Bank'],
  [1, 1, 'Houston Bank'],
  [1, 1, 'Dallas Bank'],
  [2, 4, 'Friends'],
  [2, 4, 'Family'],
]

const args = {
  passphrase,
  threshold: groupThreshold,
  groups,
  title,
}

const slip = slip39.fromArray([].toByteArray(hexSecret), args)

const fs = require('fs')
const path = require('path')

// Define the output directory and file name
const outputDir = './out'
const fileName = `${title}.txt`
const filePath = path.join(outputDir, fileName)

// Check if the directory exists, and create it if it doesn't
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// Write to the file
fs.writeFileSync(
  filePath,
  [
    JSON.stringify({ hexSecret, ...args }, null, 2),
    JSON.stringify(slip, null, 2),
  ].join('|||'),
  'utf8'
)

console.log(`File written to ${filePath}`)
console.log(fs.readFileSync(filePath).toString())
