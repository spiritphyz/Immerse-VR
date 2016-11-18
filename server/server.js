const metadata = require('../package.json');
const express = require('express');
const app = express();
const path = require('path');
const utils = require('./lib/utilities.js');
const port = 3000;

const routes = ['/', '/sf', '/lobby', '/louvre', '/berlin', '/milan/', '/rome'];


routes.forEach(function(route) {
  app.use(route, express.static(__dirname + '/../react-client'));
});


//-----------------------------------------------------------------
//------------------ GET WIKIPEDIA EXTRACT ------------------------
//-----------------------------------------------------------------
//
// Client needs to send a query string with the key "exactWikiTitle" that has
// the exact Wikipedia article title, like the final part of these URLs:
//
//   https://en.wikipedia.org/wiki/Macy's
//   https://en.wikipedia.org/wiki/Normandy_landings
//   https://en.wikipedia.org/wiki/Sant%27Agnese_in_Agone

app.get('/getWiki', function(req, res) {
  utils.fetchWiki(req, res);
});


app.listen(port, () => {
  console.log(`🌎  Listening on port ${port} for app ${metadata.name} 🌏`);
});
