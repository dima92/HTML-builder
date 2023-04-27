const path = require("path");
const fs = require("fs");
const {promises: fsPromises} = require("fs");

fs.mkdir(path.join(__dirname, "project-dist"), {recursive: true}, (err) => {
  if (err) throw err;
});

const template = fs.createReadStream(
  path.join(__dirname, "template.html"),
  "utf-8"
);
const indexHtml = fs.createWriteStream(
  path.join(__dirname, "project-dist", "index.html")
);

template.on("data", async (data) => {
  const htmlResult = await htmlBuild();
  indexHtml.write(htmlResult);

  async function htmlBuild() {
    let html = data.toString();
    const regularTags = html.match(/{{[a-zA-Z]*}}/gi);

    for (let item of regularTags) {
      const tagNameFile = item.substr(2, (item.length - 4));

      const component = await fsPromises.readFile(
        path.join(__dirname, "components", `${tagNameFile}.html`)
      );
      html = html.replace(item, component.toString());
    }
    return html;
  }
});

const resultStyles = path.join(__dirname, "project-dist", "style.css");
const sourceStyles = path.join(__dirname, "styles");
const outputStyles = fs.createWriteStream(resultStyles);

fs.readdir(sourceStyles, {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        const fileName = file.name.toString();
        const extName = file.name.toString().split(".")[1];
        if (extName === "css") {
          fs.readFile(
            path.join(__dirname, "styles", fileName),
            "utf-8",
            (err, data) => {
              if (err) throw err;
              const mergedStyles = [];
              const style = data.toString();
              mergedStyles.push(style);

              for (let i = 0; i < mergedStyles.length; i++) {
                outputStyles.write(mergedStyles[i]);
              }
            }
          );
        }
      }
    });
  }
});

const destinationAssets = path.join(__dirname, "project-dist", "assets");
const sourceAssets = path.join(__dirname, "assets");

fs.access(destinationAssets, function (error) {
  if (error) {
    copyAssets();
  } else {
    deleteAndCopyAssets();
  }
});

function copyAssets() {
  fsPromises.mkdir(destinationAssets);
  copyFiles(sourceAssets, destinationAssets);
}

async function deleteAndCopyAssets() {
  await fsPromises.rmdir(destinationAssets, {recursive: true});
  await fsPromises.mkdir(destinationAssets, {recursive: true});
  copyFiles(sourceAssets, destinationAssets);
}

function copyFiles(source, destination) {
  fs.readdir(source, {withFileTypes: true}, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((file) => {
        const fileName = file.name.toString();
        const sourcePath = path.join(source, fileName);
        const destinationPath = path.join(destination, fileName);
        if (file.isDirectory()) {
          fsPromises.mkdir(destinationPath, {recursive: true});
          copyFiles(sourcePath, destinationPath);
        } else if (file.isFile()) {
          fsPromises
            .copyFile(sourcePath, destinationPath)
            .catch(function (error) {
              console.log(error);
            });
        }
      });
    }
  });
}