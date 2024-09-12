const bip39 = require('bip39')
const { derivePath } = require('ed25519-hd-key')
const { Keypair, PublicKey } = require('@solana/web3.js')

function mnemonicToSolanaAddress(mnemonic, pathType = 'default') {
  // Validate mnemonic
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic')
  }

  // Convert mnemonic to seed
  const seed = bip39.mnemonicToSeedSync(mnemonic)

  // Define derivation paths
  const derivationPaths = {
    default: "m/44'/501'/0'/0'",
    legacyLedger: "m/44'/501'",
    legacySolana: "m/44'/501'/0'",
    bip44Change: "m/44'/501'/0'/0'",
  }

  // Select the appropriate derivation path
  const derivationPath = derivationPaths[pathType] || derivationPaths.default

  // Derive the ED25519 private key using the seed
  const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key

  // Create a Solana keypair from the derived seed
  const keypair = Keypair.fromSeed(derivedSeed)

  // Get the public key (Solana address)
  const publicKey = new PublicKey(keypair.publicKey)

  return publicKey.toBase58()
}

// Example usage
const mnemonic = 'your twenty four word mnemonic goes here'
console.log('Default:', mnemonicToSolanaAddress(mnemonic))
console.log('Legacy Ledger:', mnemonicToSolanaAddress(mnemonic, 'legacyLedger'))
console.log('Legacy Solana:', mnemonicToSolanaAddress(mnemonic, 'legacySolana'))
console.log('BIP44 Change:', mnemonicToSolanaAddress(mnemonic, 'bip44Change'))
