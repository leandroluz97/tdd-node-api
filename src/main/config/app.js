const express = require("express");
const app = express();
const setupApp = require("./setup");
const setupRoutes = require("./routes");

setupApp(app);

module.exports = app;
