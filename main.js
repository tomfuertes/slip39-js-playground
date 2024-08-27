const slip39 = require('./node_modules/slip39/index.js')

function generateSlip() {
  // Get values from the HTML inputs
  const title = document.getElementById('title').value
  const secret = document.getElementById('secret').value
  const passphrase = document.getElementById('passphrase').value
  const groupThreshold = parseInt(
    document.getElementById('groupThreshold').value
  )
  const groupsArray = JSON.parse(document.getElementById('groups-array').value)

  // Ensure the master secret is in hex format before encoding
  const masterSecret = secret.slip39EncodeHex()

  // Generate the slip39 object
  const slip = slip39.fromArray(masterSecret, {
    passphrase: passphrase,
    threshold: groupThreshold,
    groups: groupsArray,
    title: title,
  })

  // Convert the slip39 object to a JSON string and pretty-print it
  const slipJson = JSON.stringify(slip, null, 2)

  // Display the output in the textarea
  document.getElementById('output').value = slipJson
}

// Attach the generateSlip function to the Run button
document.getElementById('runButton').addEventListener('click', generateSlip)
