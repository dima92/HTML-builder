const path = require("path");
const fs = require("fs");
const {promises: fsPromises} = require("fs");

const destination = path.join(__dirname, "files-copy");
const source = path.join(__dirname, "files");

fs.access(destination, function (error) {
  if (error) {
    copyFiles();
  } else {
    deleteAndCopy();
  }
});

async function deleteAndCopy() {
  await fsPromises.rmdir(destination, { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }
  });
  copyFiles();
}

function copyFiles() {
  fs.mkdir(destination, { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }
    fs.readdir(source, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach((file) => {
          const fileName = file.name.toString();

          fsPromises
            .copyFile(
              path.join(__dirname, "files", fileName),
              path.join(__dirname, "files-copy", fileName)
            )
            .catch(function (error) {
              console.log(error);
            });
        });
        console.log("Folder Copied");
      }
    });
  });
}