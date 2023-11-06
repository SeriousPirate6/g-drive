const { exportEnvVars } = require("../env/export-env-vars");
const { pushEnvVarsToRender } = require("../env/push-env-vars-to-render");

module.exports = {
  uploadEnvVarsEndpoint: async ({ res }) => {
    try {
      exportEnvVars();
      await pushEnvVarsToRender();
      res.send({
        status: "success",
        message: "Renders Env Vars updated successfully.",
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: "failed",
        message: "Something goes wrong, could not perform the request.",
      });
    }
  },
};
