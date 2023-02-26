const path = require('path')
const fs = require('fs')
const readline = require('readline')
const {stdin: input, stdout: output} = process

const resultText = path.join(__dirname, 'text.txt')
const writeText = fs.createWriteStream(resultText)

const rl = readline.createInterface({input, output})

output.write('Пожалуйста, введите сообщение \n')
rl.on('line', (input) => {
  if (input === 'exit') rl.close()
  else {
    writeText.write(`${input}\n`)
    output.write('Введите следующее сообщение \n')
  }
})

rl.on('close', () => output.write('До скорой встречи!'))