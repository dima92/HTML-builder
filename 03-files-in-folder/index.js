const path = require('path')
const fs = require('fs')

const folder = path.join(__dirname, 'secret-folder')

fs.readdir(folder, {withFileTypes: true}, (err, files) => {
  if (err) console.log(err)
  else {
    files.forEach((file) => {
      if (file.isFile()) {
        const fileName = file.name.toString().split('.')[0]
        const extName = file.name.toString().split('.')[1]
        const filePath = path.join(__dirname, 'secret-folder', file.name)

        fs.stat(filePath, (err, stats) => {
          if (err) console.log(err)
          else {
            const fileSize = stats.size * 0.001
            console.log(`${fileName} - ${extName} - ${fileSize}kb`)
          }
        })
      }
    })
  }
})