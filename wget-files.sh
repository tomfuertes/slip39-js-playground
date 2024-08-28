echo "Are you CDed into the transient USB volume/directory? Continue y/N?"
read -r answer
if [[ "$answer" =~ ^[Yy]$ ]]; then
  echo "Continuing..."
else
  echo "Aborting..."
  exit 1
fi

echo "nodejs"
wget https://nodejs.org/download/release/latest/$(wget -qO- https://nodejs.org/download/release/latest/ | grep -o 'node-v[0-9]\+\.[0-9]\+\.[0-9]\+-linux-x64\.tar\.xz' | head -n 1)

echo "Ian Coleman bip39"
wget https://github.com/iancoleman/bip39/releases/latest/download/bip39-standalone.html

echo "Ian Coleman Shamir"
wget https://iancoleman.io/shamir/ -O ian-shamir.html

echo "Ian Coleman Shamir39"
wget https://iancoleman.io/shamir39/ -O ian-shamir39.html

echo "Ian Coleman Slip39"
wget https://iancoleman.io/shamir39/ -O ian-slip39.html

echo "Ian Coleman EIP2333"
wget https://iancoleman.io/eip2333/ -O ian-eip2333.html

echo "Bip39 Words"
wget https://raw.githubusercontent.com/bitcoin/bips/master/bip-0039/english.txt -O wordlist-bip39.txt

echo "Slip39 Words"
wget https://raw.githubusercontent.com/satoshilabs/slips/master/slip-0039/wordlist.txt -O wordlist-slip39.txt

echo "Slip39-JS"
wget https://github.com/iancoleman/bip39/releases/latest/download/bip39-standalone.html
