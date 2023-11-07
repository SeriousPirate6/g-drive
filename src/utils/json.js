const fs = require("fs");
const path = require("path");
const getDirName = require("path").dirname;

isJSON = (string) => {
  try {
    typeof string === "object"
      ? JSON.parse(JSON.stringify(string))
      : JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
};

module.exports = {
  isJSON,

  writeJSON: async (jsonFile, filePath) => {
    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath);
      if (isJSON(file)) {
        if (
          JSON.stringify(JSON.parse(file.toString())) ===
          JSON.stringify(jsonFile)
        ) {
          return;
        }
      }
    }
    fs.mkdirSync(getDirName(filePath), { recursive: true });
    console.log(`\nWriting new JSON file: ${path.basename(filePath)}...\n`);
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(jsonFile, null, 2),
      function writeJSON(err) {
        if (err) return console.log(err);
      }
    );
  },
};
