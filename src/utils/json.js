const fs = require("fs");
const path = require("path");
const getDirName = require("path").dirname;

module.exports = {
  isJSON: (isJSON = (string) => {
    try {
      JSON.parse(string);
    } catch (e) {
      return false;
    }
    return true;
  }),

  writeJSON: async (jsonFile, filePath) => {
    if (fs.existsSync(filePath)) {
      if (isJSON(fs.readFileSync(filePath))) {
        if (
          JSON.stringify(JSON.parse(fs.readFileSync(filePath))) ===
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
