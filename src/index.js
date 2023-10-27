const express = require("express");
const bodyParser = require("body-parser");
const { nameToFileId } = require("./endpoints/name-to-file-id");

const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});

app.get("/keepAlive", async ({ res }) => {
  res.send({
    status: "success",
    message: "Service running",
  });
});

app.get("/nameToFileId", nameToFileId);

(async () => {
  //   await authenticate();
  //   await remainingSpace({ print: true });
})();
