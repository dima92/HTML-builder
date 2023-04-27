const path = require("path");
const fs = require("fs");

const resultStyles = path.join(__dirname, "project-dist", "bundle.css");
const source = path.join(__dirname, "styles");
const output = fs.createWriteStream(resultStyles);

fs.readdir(source, {withFileTypes: true}, (err, files) => {
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
                output.write(mergedStyles[i]);
              }
            }
          );
        }
      }
    });
  }
});