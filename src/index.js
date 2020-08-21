import express from "express";
import config from "./config";
import proxy from "express-http-proxy"

const app = express();
const port = 5000;

var currentURL = `http://${config.uniconfigUiHost}`

// --- Switching URLs to get static files ---

const URLswitch = function (req, res, next) {
  let path = req.route.path
  if (path === "/") {
    currentURL = `http://${config.dashboardHost}`
  } else if (path === "/uniflow/ui*") {
    currentURL = `http://${config.uniflowUiHost}`
  } else if (path === "/uniconfig/ui*") {
    currentURL = `http://${config.uniconfigUiHost}`
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
  proxy(`http://${config.uniconfigUiHost}`, {
    proxyReqPathResolver: (req) => {
      return req.url
    }
  }),
);

app.all(
  "/uniconfig/api/*", URLswitch,
  proxy(`http://${config.uniconfigApiHost}`, {
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
    proxyReqPathResolver: (req) => {
      return req.url
    }
  }),
);

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));