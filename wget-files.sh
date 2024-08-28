#!/bin/sh

echo "Are you CDed into the transient USB volume/directory? Continue y/N?"
read -r answer
if [[ "$answer" =~ ^[Yy]$ ]]; then
  echo "Continuing..."
else
  echo "Aborting..."
  exit 1
fi

echo "Downloading Node.js"
curl -s -O https://nodejs.org/download/release/latest/$(curl -s https://nodejs.org/download/release/latest/ | grep -o 'node-v[0-9]\+\.[0-9]\+\.[0-9]\+-linux-x64\.tar\.xz' | head -n 1)

echo "Downloading Ian Coleman BIP39"
curl -s -O https://github.com/iancoleman/bip39/releases/latest/download/bip39-standalone.html

echo "Downloading Ian Coleman Shamir"
curl -s -o ian-shamir.html https://iancoleman.io/shamir/ 

echo "Downloading Ian Coleman Shamir39"
curl -s -o ian-shamir39.html https://iancoleman.io/shamir39/ 

echo "Downloading Ian Coleman Slip39"
curl -s -o ian-slip39.html https://iancoleman.io/shamir39/ 

echo "Downloading Ian Coleman EIP2333"
curl -s -o ian-eip2333.html https://iancoleman.io/eip2333/ 

echo "Downloading BIP39 Words"
curl -s -o wordlist-bip39.txt https://raw.githubusercontent.com/bitcoin/bips/master/bip-0039/english.txt

echo "Downloading Slip39 Words"
curl -s -o wordlist-slip39.txt https://raw.githubusercontent.com/satoshilabs/slips/master/slip-0039/wordlist.txt

echo "Slip39-JS-v0.1.9"
curl -s -o slip39-js.tar.gz https://github.com/ilap/slip39-js/archive/refs/tags/v0.1.9.tar.gz
npm view slip39 | grep latest

