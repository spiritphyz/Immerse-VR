const bodyParser = require('body-parser');
const request = require('request');
const metadata = require('../package.json');
const Entities = require('html-entities').AllHtmlEntities;
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const entities = new Entities(); // decode strings like '&amp;'
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


app.get('/getWiki', function(req, res) {
  const url = 'http://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles='
              + req.query.exactWikiTitle 
              + '&format=json&exintro=1';
  request(url, (err, requestResponse, body) => {
    if (err) {
      console.log('Error in Wikipedia fetch', err);
    } else {
      const query = (JSON.parse(body)).query.pages;
      const text = query[(Object.keys(query)[0])].extract;
      const regex = /(<([^>]+)>)/ig;
      const firstParagraph = text.slice(0, text.indexOf('\n'));
      const result = firstParagraph.replace(regex, '');
      
      const regexApostrophes = /(\')/ig;
      let output = result.replace(regexApostrophes, '\'');
      output = entities.decode(output);
      console.log('Sending scrubbed wiki text:', output);

      res.status(200).send(JSON.stringify(output));
    }
  });
});


app.listen(port, () => {
  console.log(`🌎  Listening on port ${port} for app ${metadata.name} 🌏`);
});
