const slip39 = require('slip39')
// threshold (N) number of group-shares required to reconstruct the master secret.
const groupThreshold = 4
const hexSecret =
  '1990635ae88560f7743d0eaf728125e5de6364eac080244ebb560ce9b4e77651'
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

const SEPARATOR = '\n'
const indexToChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// Write to the file
fs.writeFileSync(
  filePath,
  [
    `hexSecret: ${hexSecret}`,
    `ID: ${hexSecret}:`,
    groups
      .map(([_, groupCount, groupName], groupIndex) => {
        const results = []
        for (let index = 0; index < groupCount; index++) {
          const mnemonic = slip.fromPath(`r/${groupIndex}/${index}`).mnemonics
          results.push(
            ` - ${indexToChar[groupIndex]}: ${groupName} (${index + 1}/${groupCount}): ${mnemonic}`
          )
        }
        return results.join(SEPARATOR)
      })
      .join(SEPARATOR),

    SEPARATOR,
    '---DEBUG---',
    SEPARATOR,
    JSON.stringify({ hexSecret, ...args }, null, 2),
    JSON.stringify(slip, null, 2),
  ].join(SEPARATOR),
  'utf8'
)

console.log(`File written to ${filePath}`)
console.log(fs.readFileSync(filePath).toString())

console.log(`Write these down then wipe and uninstall tails`)
