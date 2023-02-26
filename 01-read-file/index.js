const path = require('path')
const fs = require('fs')

const resultText = path.join(__dirname, 'text.txt')
const rs = fs.createReadStream(resultText, 'utf8')

rs.on('data', chunk => process.stdout.write(chunk))