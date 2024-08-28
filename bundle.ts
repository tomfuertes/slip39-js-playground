import { unlinkSync } from 'node:fs'

;(async () => {
  // Define the paths
  const htmlFilePath = './dist/main.html'
  const jsFilePath = './dist/main.js'

  // Read the HTML file
  let htmlContent = await Bun.file(htmlFilePath).text()

  // Read the JavaScript file
  let jsContent = await Bun.file(jsFilePath).text()

  // patch the jsContent
  jsContent = jsContent.replace(
    /^\s+process\.env\.NODE_DEBUG.+$/gm,
    '/*not node*/'
  )

  // Replace the script tag with the contents of the JavaScript file
  const newScriptTag = `<script type="module">\n${jsContent}\n</script>`
  htmlContent = htmlContent.replace(
    '<script type="module" src="./main.js"></script>',
    newScriptTag
  )

  // Write the updated HTML content back to the file
  await Bun.write(htmlFilePath, htmlContent)

  unlinkSync(jsFilePath)

  console.log(
    `Updated ${htmlFilePath}: Replaced script tag with the contents of ${jsFilePath}`
  )
})()
