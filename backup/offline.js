/**
 * NOTE: I was out of my depth trying to automate this w/o knowing how to condense the entropy into lengths well or continue
 * Leaving here to revisit and opting for a more node on tails friendly approach
 */

// $ npm install bitcoinjs-lib browserify
// $ npx browserify --standalone bitcoin -o bitcoinjs-lib.js <<< "module.exports = require('bitcoinjs-lib');"

const bip39 = require('bip39')
const slip39 = require('slip39')

const fs = require('fs')
const entropies = []

try {
  const data = fs.readFileSync('./entropy.txt', 'utf8')
  const lines = data.split('\n')

  lines.forEach((line, index) => {
    if (line.startsWith('#')) return
    entropies.push(line)
  })

  console.log('File reading completed.')
} catch (err) {
  console.error('Error reading the file:', err)
}

console.log({ entropies })

// https://raw.githubusercontent.com/iancoleman/bip39/master/src/js/entropy.js
// // log2(6) = 2.58496 bits per roll, with bias
// // 4 rolls give 2 bits each
// // 2 rolls give 1 bit each
// // Average (4*2 + 2*1) / 6 = 1.66 bits per roll without bias
// "base 6 (dice)": {
//     "0": "00", // equivalent to 0 in base 6
//     "1": "01",
//     "2": "10",
//     "3": "11",
//     "4": "0",
//     "5": "1",
// },

const mapping = {
  1: '00', // equivalent to 0 in base 6
  2: '01',
  3: '10',
  4: '11',
  5: '0',
  6: '1',
}

const bits = entropies.map((dice) => {
  let result = ''

  for (const char of dice) {
    if (mapping.hasOwnProperty(char)) {
      result += mapping[char]
    } else {
      console.error(`Invalid character encountered: ${char}`)
    }
  }

  console.log(result.length)

  return result
})
console.log({ bits })

function parseBigInt(str, base = 10) {
  base = BigInt(base)
  var bigint = BigInt(0)
  for (var i = 0; i < str.length; i++) {
    var code = str[str.length - 1 - i].charCodeAt(0) - 48
    if (code >= 10) code -= 39
    bigint += base ** BigInt(i) * BigInt(code)
  }
  return bigint
}

const hexs = bits.map((bitString) => {
  return parseBigInt(bitString, 2).toString(16).substring(0, 64)
})

console.log({ hexs })

const mnemonics = hexs.map((hex) => {
  return bip39.entropyToMnemonic(hex)
})

console.log({ mnemonics })

// /**
//  * Example files from libs for ref
//  */
// // Generate a random mnemonic (uses crypto.randomBytes under the hood), defaults to 128-bits of entropy
// const mnemonic = bip39.generateMnemonic()
// // => 'seed sock milk update focus rotate barely fade car face mechanic mercy'

// bip39.mnemonicToSeedSync('basket actual').toString('hex')
// // => '5cf2d4a8b0355e90295bdfc565a022a409af063d5365bb57bf74d9528f494bfa4400f53d8349b80fdae44082d7f9541e1dba2b003bcfec9d0d53781ca676651f'

// bip39.mnemonicToSeedSync('basket actual')
// // => <Buffer 5c f2 d4 a8 b0 35 5e 90 29 5b df c5 65 a0 22 a4 09 af 06 3d 53 65 bb 57 bf 74 d9 52 8f 49 4b fa 44 00 f5 3d 83 49 b8 0f da e4 40 82 d7 f9 54 1e 1d ba 2b ...>

// // mnemonicToSeed has an synchronous version
// // mnemonicToSeedSync is less performance oriented
// bip39.mnemonicToSeed('basket actual').then(console.log)
// // => <Buffer 5c f2 d4 a8 b0 35 5e 90 29 5b df c5 65 a0 22 a4 09 af 06 3d 53 65 bb 57 bf 74 d9 52 8f 49 4b fa 44 00 f5 3d 83 49 b8 0f da e4 40 82 d7 f9 54 1e 1d ba 2b ...>

// bip39
//   .mnemonicToSeed('basket actual')
//   .then((bytes) => bytes.toString('hex'))
//   .then(console.log)
// // => '5cf2d4a8b0355e90295bdfc565a022a409af063d5365bb57bf74d9528f494bfa4400f53d8349b80fdae44082d7f9541e1dba2b003bcfec9d0d53781ca676651f'

// bip39.mnemonicToSeedSync('basket actual', 'a password')
// // => <Buffer 46 16 a4 4f 2c 90 b9 69 02 14 b8 fd 43 5b b4 14 62 43 de 10 7b 30 87 59 0a 3b b8 d3 1b 2f 3a ef ab 1d 4b 52 6d 21 e5 0a 04 02 3d 7a d0 66 43 ea 68 3b ... >

// bip39.validateMnemonic(mnemonic)
// // => true

// bip39.validateMnemonic('basket actual')
// // => false

// // defaults to BIP39 English word list
// // uses HEX strings for entropy
// const mnemonic2 = bip39.entropyToMnemonic('00000000000000000000000000000000')
// // => abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about

// // reversible
// bip39.mnemonicToEntropy(mnemonic2)
// // => '00000000000000000000000000000000'

// // threshold (N) number of group-shares required to reconstruct the master secret.
// const groupThreshold = 2
// const masterSecret = 'ABCDEFGHIJKLMNOP'.slip39EncodeHex()
// // or if already hex: [].toByteArray("c4b6d998c265c56c983731676ea732e4");
// const passphrase = 'TREZOR'

// function recover(groupShares, pass) {
//   const recoveredSecret = slip39.recoverSecret(groupShares, pass)
//   console.log('\tMaster secret: ' + masterSecret.slip39DecodeHex())
//   console.log('\tRecovered one: ' + recoveredSecret.slip39DecodeHex())
//   // assert(masterSecret.slip39DecodeHex() === recoveredSecret.slip39DecodeHex())
// }

// function printShares(shares) {
//   shares.forEach((s, i) => console.log(`\t${i + 1}) ${s}`))
// }

// /**
//  * 4 groups shares:
//  *    = two for Alice
//  *    = one for friends and
//  *    = one for family members
//  * Any two (see threshold) of these four group-shares are required to reconstruct the master secret
//  * i.e. to recover the master secret the goal is to reconstruct any 2-of-4 group-shares.
//  * To reconstruct each group share, we need at least N of its M member-shares.
//  * Thus all possible master secret recovery combinations:
//  * Case 1) [requires 1 person: Alice] Alice alone with her 1-of-1 member-shares reconstructs both the 1st and 2nd group-shares
//  * Case 2) [requires 4 persons: Alice + any 3 of her 5 friends] Alice with her 1-of-1 member-shares reconstructs 1st (or 2nd) group-share + any 3-of-5 friend member-shares reconstruct the 3rd group-share
//  * Case 3) [requires 3 persons: Alice + any 2 of her 6 family relatives] Alice with her 1-of-1 member-shares reconstructs 1st (or 2nd) group-share + any 2-of-6 family member-shares reconstruct the 4th group-share
//  * Case 4) [requires 5 persons: any 3 of her 5 friends + any 2 of her 6 family relatives] any 3-of-5 friend member-shares reconstruct the 3rd group-share + any 2-of-6 family member-shares reconstruct the 4th group-share
//  */
// const groups = [
//   // Alice group-shares. 1 is enough to reconstruct a group-share,
//   // therefore she needs at least two group-shares to reconstruct the master secret.
//   [1, 1, 'Alice personal group share 1'],
//   [1, 1, 'Alice personal group share 2'],
//   // 3 of 5 Friends' shares are required to reconstruct this group-share
//   [3, 5, 'Friends group share for Bob, Charlie, Dave, Frank and Grace'],
//   // 2 of 6 Family's shares are required to reconstruct this group-share
//   [2, 6, 'Family group share for mom, dad, brother, sister and wife'],
// ]

// const slip = slip39.fromArray(masterSecret, {
//   passphrase: passphrase,
//   threshold: groupThreshold,
//   groups: groups,
//   title: 'Slip39 example for 2-level SSSS',
// })

// let requiredGroupShares
// let aliceBothGroupShares
// let aliceFirstGroupShare
// let aliceSecondGroupShare
// let friendGroupShares
// let familyGroupShares

// /*
//  * Example of Case 1
//  */
// // The 1st, and only, member-share (member 0) of the 1st group-share (group 0) + the 1st, and only, member-share (member 0) of the 2nd group-share (group 1)
// aliceBothGroupShares = slip
//   .fromPath('r/0/0')
//   .mnemonics.concat(slip.fromPath('r/1/0').mnemonics)

// requiredGroupShares = aliceBothGroupShares

// console.log(
//   `\n* Shares used by Alice alone for restoring the master secret (total of ${requiredGroupShares.length} member-shares):`
// )
// printShares(requiredGroupShares)
// recover(requiredGroupShares, passphrase)

// /*
//  * Example of Case 2
//  */
// // The 1st, and only, member-share (member 0) of the 2nd group-share (group 1)
// aliceSecondGroupShare = slip.fromPath('r/1/0').mnemonics

// // ...plus the 3rd member-share (member 2) + the 4th member-share (member 3) + the 5th member-share (member 4) of the 3rd group-share (group 2)
// friendGroupShares = slip
//   .fromPath('r/2/2')
//   .mnemonics.concat(slip.fromPath('r/2/3').mnemonics)
//   .concat(slip.fromPath('r/2/4').mnemonics)

// requiredGroupShares = aliceSecondGroupShare.concat(friendGroupShares)

// console.log(
//   `\n* Shares used by Alice + 3 friends for restoring the master secret (total of ${requiredGroupShares.length} member-shares):`
// )
// printShares(requiredGroupShares)
// recover(requiredGroupShares, passphrase)

// /*
//  * Example of Case 3
//  */
// // The 1st, and only, member-share (member 0) of the 1st group-share (group 0)
// aliceFirstGroupShare = slip.fromPath('r/0/0').mnemonics

// // ...plus the 2nd member-share (member 1) + the 3rd member-share (member 2) of the 4th group-share (group 3)
// familyGroupShares = slip
//   .fromPath('r/3/1')
//   .mnemonics.concat(slip.fromPath('r/3/2').mnemonics)

// requiredGroupShares = aliceFirstGroupShare.concat(familyGroupShares)

// console.log(
//   `\n* Shares used by Alice + 2 family members for restoring the master secret (total of ${requiredGroupShares.length} member-shares):`
// )
// printShares(requiredGroupShares)
// recover(requiredGroupShares, passphrase)

// /*
//  * Example of Case 4
//  */
// // The 3rd member-share (member 2) + the 4th member-share (member 3) + the 5th member-share (member 4) of the 3rd group-share (group 2)
// friendGroupShares = slip
//   .fromPath('r/2/2')
//   .mnemonics.concat(slip.fromPath('r/2/3').mnemonics)
//   .concat(slip.fromPath('r/2/4').mnemonics)

// // ...plus the 2nd member-share (member 1) + the 3rd member-share (member 2) of the 4th group-share (group 3)
// familyGroupShares = slip
//   .fromPath('r/3/1')
//   .mnemonics.concat(slip.fromPath('r/3/2').mnemonics)

// requiredGroupShares = friendGroupShares.concat(familyGroupShares)

// console.log(
//   `\n* Shares used by 3 friends + 2 family members for restoring the master secret (total of ${requiredGroupShares.length} member-shares):`
// )
// printShares(requiredGroupShares)
// recover(requiredGroupShares, passphrase)

// // function bytesToHex(u8) {
// //   let h = "";
// //   for (i=0; i<u8.length; i++) {
// //       hexChars = u8[i].toString(16);
// //       while (hexChars.length % 2 != 0) {
// //           hexChars = "0" + hexChars;
// //       }
// //       h += hexChars;
// //   }
// //   return h;
// // }

// // function hexToBytes(h) {
// //   // Is left padding suitable here?
// //   if (h.length % 2 != 0) {
// //       h = "0" + h;
// //   }
// //   // create bytes
// //   let a = [];
// //   for (i=0; i<h.length; i+=2) {
// //       let b = parseInt(h.substring(i, i+2), 16)
// //       a.push(b);
// //   }
// //   return a;
// // }
