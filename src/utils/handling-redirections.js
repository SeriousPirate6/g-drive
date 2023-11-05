const { https } = require("follow-redirects");

module.exports = {
  handlingRedirects: (handlingRedirects = async (videoUrl) => {
    return new Promise((resolve) => {
      const options = {
        method: "HEAD",
        maxRedirects: 10,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:34.0) Gecko/20100101 Firefox/34.0",
        },
      };

      const request = https.request(videoUrl, options, (response) => {
        const finalUrl = response.responseUrl;
        resolve(finalUrl);
      });

      request.end();
    });
  }),
};
