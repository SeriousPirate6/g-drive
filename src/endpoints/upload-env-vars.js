const { exportEnvVars } = require("../env/export-env-vars");
const { pushEnvVarsToRender } = require("../env/push-env-vars-to-render");
const { checkJwtToken } = require("../authentication/middleware");

const uploadEnvVarsEndpoint = async ({ res }) => {
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
};

module.exports = {
  uploadEnvVarsEndpoint_authenticated: async (req, res) => {
    await checkJwtToken(req, res, uploadEnvVarsEndpoint);
  },
};
