import express from "express";
import config from "./config";
import proxy from "express-http-proxy";
import https from "https";
import fs from "fs";
import conf from "./config";

const app = express();
const port = 5000;

var currentURL = `${config.uniconfigUiProtocol}://${config.uniconfigUiHost}`

// --- Switching URLs to get static files ---

const URLswitch = function (req, res, next) {
  let path = req.route.path
  if (path === "/") {
    currentURL = `http://${config.dashboardHost}`
  } else if (path === "/uniflow/ui*") {
    currentURL = `http://${config.uniflowUiHost}`
  } else if (path === "/uniconfig/ui*") {
    currentURL = `${config.uniconfigUiProtocol}://${config.uniconfigUiHost}`
  }
  next()
}

// --- DASHBOARD ---

app.all(
  "/", URLswitch,
  proxy(`http://${config.dashboardHost}`, {
    proxyReqPathResolver: (req) => {
      return req.url
    }
  }),
);

// --- UNIFLOW ---

app.all(
  "/uniflow/ui*", URLswitch,
  proxy(`http://${config.uniflowUiHost}`, {
    proxyReqPathResolver: (req) => {
      return req.url
    }
  }),
);

app.all(
  "/uniflow/api/*", URLswitch,
  proxy(`http://${config.uniflowApiHost}`, {
    proxyReqPathResolver: (req) => {
      const path = req.url.substr('/uniflow/api'.length)
      return path;
    }
  })
);

// --- UNICONFIG ---

app.all(
  "/uniconfig/ui*", URLswitch,
  proxy(`${config.uniconfigUiProtocol}://${config.uniconfigUiHost}`, {
    proxyReqOptDecorator: function (proxyReqOpts, originalReq) {
      proxyReqOpts.rejectUnauthorized = false
      return proxyReqOpts;
    },
    proxyReqPathResolver: (req) => {
      return req.url
    }
  }),
);

app.all(
    "/uniconfig/api/*", URLswitch,
    proxy(`${config.uniconfigApiProtocol}://${config.uniconfigApiHost}`, {
        proxyReqOptDecorator: function (proxyReqOpts, originalReq) {
            proxyReqOpts.rejectUnauthorized = false
            return proxyReqOpts;
        },
        proxyReqPathResolver: (req) => {
            const path = req.url.substr('/uniconfig/api'.length)
            return path;
        }
    })
);

/* 
  This is has to be there otherwise static files (*.js,css,wfonts...) 
  will be server from "/" instead of actual path.
*/

const getUrl = () => currentURL

app.all(
  "/*", URLswitch,
  proxy(() => getUrl(), {
    proxyReqOptDecorator: function (proxyReqOpts, originalReq) {
      proxyReqOpts.rejectUnauthorized = false
      return proxyReqOpts;
    },
    proxyReqPathResolver: (req) => {
      return req.url
    }
  }),
);

if (conf.apiGatewayHTTPS == 'true') {
  const server = https.createServer({
    key: fs.readFileSync('./certificates/key.pem'),
    cert: fs.readFileSync('./certificates/cert.pem'),
  }, app)

  server.listen(port, () => {
    console.log(`Listening at https://localhost:${port}`);
  });
} else {
  app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
}
