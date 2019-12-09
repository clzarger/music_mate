'use strict';
var ugs = require('ultimate-guitar-scraper');

// const promisify = func => new Promise((resolve, reject) => {
//     func((error, result) => {
//         if (error) reject(error)
//         else resolve(result)
//     });
// });

module.exports.getSong = async event => {
// const getSong = async event => {
    // just in case
    console.log('query params:', event.queryStringParameters);

    var name = event.queryStringParameters.name;
    var artist = event.queryStringParameters.artist;
      if(name == undefined || artist == undefined){
        return {
          statusCode: 400,
          headers: {
          // "Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
          // "Content-Type": "package/json"
          },
          body: "Name or artist are missing"
        };
      };

    var query = {
        query: name,
        type: ['Chords']
    };
        console.log("query:",query);
    const searchPromise = () => new Promise((resolve, reject) => {
        ugs.search(query, function (searchError, tabs, response, body) {
                console.log("searchError:",searchError);
                console.log("tabs:",tabs);
                console.log("response:",response);
                console.log("body:",body);
            if (searchError) {
                console.log("Issue on ugs search");
                reject(searchError);
            } else {
                const tabFilteredByArtist = tabs.filter(hi => hi.artist.toLowerCase().indexOf(artist.toLowerCase()) > -1);
                const tabSortedByBest = tabFilteredByArtist.sort((a, b) => (a.rating < b.rating ? 1 : -1));
                if(tabSortedByBest.length === 0){
                  reject("No songs found");
                  return
                };
                  const tabUrl = tabSortedByBest[0]['url'];
                ugs.get(tabUrl, function (getError, tab) {
                    if (getError) {
                        console.log("Issue on ugs get");
                        reject(getError);
                    } else {
                        resolve(tab);
                    }
                });
            }
        });
    });

    try {
        const result = await searchPromise();
        return {
            statusCode: 200,
            headers: {
              // "Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS
              "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
              // "Content-Type": "package/json"
            },
            body: JSON.stringify(result)
        };
    } catch (e) {
        console.error(e);
        return {
            statusCode: 500,
            // headers: {
            //   "Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS
            //   "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            //   "Content-Type": "application/json"
            // },
            body: JSON.stringify(e)
        };
    }

};

// console.log(getSong({
//   queryStringParameters: {
//     name: "cornerstone",
//     artist: "hillsongs"
//   }
// }));
