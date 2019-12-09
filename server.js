var express = require('express');
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var router = express.Router();              // get an instance of the express Router
var ugs = require('ultimate-guitar-scraper');

// fix ECONNRESET Error
// require('longjohn');

// port to run the app on
const port = process.env.PORT || 80;

// FRONTEND
app.use('/', express.static('./dist'));

// BACKEND
app.use('/api', router);

app.listen(port);

console.log('Server is running on port ' + port);

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/song', function(req, res) {

var name = req.query.name;
var artist = req.query.artist;

  var query = {
    query: name,
    type: ['Chords']
  }

  function callback (error, tabs, response, body) {
    if (error) {
      console.log("Issue on server!")
      console.log(error)
    } else {
      let tabFilteredByArtist = tabs.filter(hi => hi.artist === artist);
      let tabSortedByBest = tabFilteredByArtist.sort((a, b) => (a.rating < b.rating ? 1 : -1));
      let tabUrl = tabSortedByBest[0]['url'];
      ugs.get(tabUrl, function (error, tab) {
        if (error) {
          console.log("Issue on server! (ugs)")
          console.log(error)
        } else {
          res.json(tab);
        }
      })
    }
  }

  ugs.search(query, callback)

});






//Tylor's example for ASYNCHRONOUS DOWNLOADS
//
// window.slides = function() {
// 	// grab all of your data, exactly like you're doing now
// 	var title1 = ...
// 	var artist1 = ...
// 	var title2 = ...
// 	var artist2 = ...
// 	var title3 = ...
// 	var artist3 = ...
//
// 	// create your pptx variable HERE!!!
// 	// you want to create it here so you're starting
// 	// fresh with a new slideshow each time
// 	var pptx = new PptxGenJS();
//
// 	// now you get call your api for each title/artist and get the chords
// 	// but getSong returns a promise, which means it's ASYNCHRONOUS. You'll
// 	// want to get ALL of your chords before making the slideshow. You can send
// 	// all of your requests in parallel by calling all three and putting the promise
// 	// returned from each call into an array, like so:
// 	const chordsPromises = [
// 		getSong(title1, artist1),
// 		getSong(title2, artist2),
// 		getSong(title3, artist3)
// 	];
// 	// then, you pass them to the Promise.all function
// 	return Promise.all(chordsPromises).then(function(chords) {
// 		chords.forEach(function(chordsInput) {
// 			reformat(pptx, chordsInput);
// 		});
// 	}).then(function() {
// 		pptx.save('Lyrics Slideshow');
// 	}).catch(function(e) {
// 		console.error('Something terrible has happened!', e);
// 	});
// }














//
// //PRE API CREATION SERVER FILE IS FOUND BELOW
//
// const express = require('express');
//
// // //Casey addition
// // const cors = require('cors');
//
// // port to run the app on
// const port = process.env.PORT || 80;
//
// // create the main instance of the app
// const app = express();
//
// // //Casey addition
// // app.use(function(req, res, next) {
// //   res.header('Access-Control-Allow-Origin', "*");
// //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
// //   res.header('Access-Control-Allow-Headers', 'Content-Type');
// //   next();
// // });
//
// // FRONTEND
// app.use('/', express.static('./dist'));
// // add in /api
//
// // //Casey addition
// // app.use(cors());
//
// app.listen(port);
//
// console.log('Server is running on port ' + port);
