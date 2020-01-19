// ===================================== NODE PACKAGES =====================================
const temp = require('./temp');
const PDFDocument = require('pdfkit');
const blobStream = require('blob-stream');
const axios = require('axios');


// ===================================== TITLE CASE FUNCTION =====================================
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// ===================================== TEST FUNCTION for array =====================================
window.loop = function () {
    var songLyrics_v8 = 'HEY THIS [1] text for the first slide [2] second slide [3] third one [4] fourth one [5] fifth';

  // find number of slides
    var numberOfSlides = (songLyrics_v8.match(/\[/g) || []).length;

  // create arrays & first index (javascript arrays use 0 for the first entry. I set it to -1 & skip it)
    let slideStartIndicesArr = [-1];
    let slideArr_w_whitespace_headers = [-1];
    let slideArr_w_whitespace = [-1];
    let slideArr = [-1];

  // find slide start indices based on brackets (and store in array)
    for (let i = 0; i < numberOfSlides; i++){
      slideStartIndicesArr[i+1] = songLyrics_v8.indexOf("[", slideStartIndicesArr[i] + 1)
    };  //i didn't put this loop in the next one because the isolate slides piece needs to have all indices ready

  // sort input lyrics into slides & cleanup
  for (let i = 0; i < numberOfSlides; i++){
    // isolate slide lyrics (separate slides based on indices)
    slideArr_w_whitespace_headers[i+1] = songLyrics_v8.slice(slideStartIndicesArr[i+1], slideStartIndicesArr[i+2])
    // remove verse & chorus headers
    slideArr_w_whitespace[i+1] = slideArr_w_whitespace_headers[i+1].replace(/\[.*\]/g, "");
    // remove white space
    slideArr[i+1] = slideArr_w_whitespace[i+1].trim();
    };

// DEBUG
console.log(slideStartIndicesArr);
console.log(slideArr_w_whitespace_headers);
console.log(slideArr_w_whitespace);
console.log(slideArr);

//create pptx variable
var pptx = new PptxGenJS();

// create blank pptx file
pptx.setLayout('LAYOUT_4x3');

//fake inputs
var songName = 'test';
var songArtist = 'shoooot';

if (isNaN('Title')) {
    //Title Slide
    var pptxTitleSlide = pptx.addNewSlide({ bkgd: '000000' });
    pptxTitleSlide.addText(songName, {x: 1.25, y: 3.5, font_size: 40, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'middle'});
    pptxTitleSlide.addText(songArtist, {x: 1.25, y: 4.5, font_size: 20, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'middle'});

    // loop
      for (let i = 0; i < numberOfSlides; i++){
        var pptxLyricSlides = pptx.addNewSlide({ bkgd: '000000' });
        pptxLyricSlides.addText(slideArr[i+1], {x: 1.25, y: '3%', font_size: 30, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'top'});
      };
  };

  // this is done in the full loop below. just here for testing
  pptx.save('Lyrics Slideshow');


  };


// =================================================================================================
// ===================================== LYRIC SLIDESHOW (PPT) =====================================
// =================================================================================================
function reformatSlides(pptx, songName, songArtist, songLyrics) {
    // Reformat input with REGEX (potentially helpful regex:\n.*\n.*\n.*$)
      // remove chords (when I used ugs, just needed this and skipped the next two regex expressions)
      var songLyrics_v1 = songLyrics.replace(/(\[ch\].*\[*c*h*\])/gm, "");
        // remove chords
        var songLyrics_v2 = songLyrics_v1.replace(/\b([CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|add)*[\d\/]*(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|add)*[\d\/]*)*)(?=\s|$)(?!\w)/gm, "");
        // remove blank lines where chords used to be
        var songLyrics_v3 = songLyrics_v2.replace(/^\s*[\r\n]*/gm, "");
      //remove song intro text
      var songLyrics_v4 = songLyrics_v3.replace(/".+[\s\S].+.[\s\S].+.[\s\S].+.[\s\S]/gm, "");
      //remove end of song " mark
      var songLyrics_v5 = songLyrics_v4.replace(/"/gm, "");
      //remove riff tabs (if present)
      var songLyrics_v6 = songLyrics_v5.replace(/.\|-.*/gm, "");
      //remove [solo] & [instrumental]
      var songLyrics_v7 = songLyrics_v6.replace(/\[Solo\]|\[solo\]|\[Instrumental\]|\[instrumental\]/gm, "");
      //remove extra spaces & blank lines
      var songLyrics_v8 = songLyrics_v7.replace(/\r?\n\s*\n/gm, "\r\n");

    // find number of slides
      var numberOfSlides = (songLyrics_v8.match(/\[/g) || []).length;

    // create arrays & first index (javascript arrays use 0 for the first entry. I set it to -1 & skip it)
      let slideStartIndicesArr = [-1];
      let slideArr_w_whitespace_headers = [-1];
      let slideArr_w_whitespace = [-1];
      let slideArr = [-1];

    // find slide start indices based on brackets (and store in array)
      for (let i = 0; i < numberOfSlides; i++){
        slideStartIndicesArr[i+1] = songLyrics_v8.indexOf("[", slideStartIndicesArr[i] + 1)
      };  //i didn't put this loop in the next one because the isolate slides piece needs to have all indices ready

    // sort input lyrics into slides & cleanup
    for (let i = 0; i < numberOfSlides; i++){
      // isolate slide lyrics (separate slides based on indices)
      slideArr_w_whitespace_headers[i+1] = songLyrics_v8.slice(slideStartIndicesArr[i+1], slideStartIndicesArr[i+2])
      // remove verse & chorus headers
      slideArr_w_whitespace[i+1] = slideArr_w_whitespace_headers[i+1].replace(/\[.*\]/g, "");
      // remove white space
      slideArr[i+1] = slideArr_w_whitespace[i+1].trim();
    };

    // split up slides that have too many lines, loads in one slide at a time using: slideArr[i+1]
    for (let i = 0; i < numberOfSlides; i++){
      //debug
      console.log('loop start (loading in one slide)');
      // find the number of new line characters ( "\n" )
      var numberOfNewLines = (slideArr[i+1].match(/\n/g) || []).length;
      // add one to find the actual number of lines (since the last line doesn't have a '\n', this step creates a more intuitive variable to work with)
      var numberOfLines = numberOfNewLines + 1;
      // split based on number of lines on the slide
      if (numberOfLines >= 6) {
        // split up the loaded slide into an array by new line
        var oneSlide_SplitByNewline_Arr = slideArr[i+1].split(/\n/g);
       // Divide input array into chunks of the requested size
        function chunkArray(myArray, chunk_size){
          var index = 0;
          var arrayLength = myArray.length;
          var tempArray = [];
          for (index = 0; index < arrayLength; index += chunk_size) {
            var myChunk = myArray.slice(index, index + chunk_size);
            // Do something if you want with the group
            tempArray.push(myChunk);
          };
          return tempArray;
        };
        // find # of slides needed by dividing number of lines by 5, then taking the ceiling
        var numberOfSlidesNeeded = Math.ceil(numberOfLines/5);
        // find # of lines per slide
        var linesPerSlide = Math.ceil(numberOfLines/numberOfSlidesNeeded);
        // chunk into groups that are equal to the number of lines per slide
        var chunkedArrayNew = chunkArray(oneSlide_SplitByNewline_Arr, linesPerSlide);
        // array to string function
        function arrayToString(array) {
          var string = "";
          for (let j = 0; j < array.length; j++){
            var string = string + array[j] + '\n';
          };
          return string = string.slice(0, -1);
        };
        // convert arrays (so they can properly be added to the master slides aka slideArr)
        // if you don't do this, it adds the array as a single element, which breaks things
        var chunkedStringNew = [];
        for (let k = 0; k < chunkedArrayNew.length; k++){
          chunkedStringNew[k] = arrayToString(chunkedArrayNew[k]);
        };
        // at current index, remove 0 elements, then add the text to that position
        for (let l = 0; l < chunkedStringNew.length; l++){
          slideArr.splice(i+1+l, 0, chunkedStringNew[l]);
        };
        // skip ahead of the two split slides I just inserted & remove the old combined one
        slideArr.splice(i+1+chunkedStringNew.length, 1);
        // update numberOfSlides in the full deck. Otherwise, this loop will get messed up
        var numberOfSlides = numberOfSlides + numberOfSlidesNeeded - 1;
      };
    };

    //debug
    console.log('finished slide arrary', slideArr, '\n');

    // create blank pptx file
    pptx.setLayout('LAYOUT_4x3');

      if (isNaN('Title')) {
        // create title slide
        var pptxTitleSlide = pptx.addNewSlide({ bkgd: '000000' });
        pptxTitleSlide.addText(songName, {x: 1.25, y: 3.5, font_size: 40, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'middle'});
        pptxTitleSlide.addText(songArtist, {x: 1.25, y: 4.5, font_size: 20, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'middle'});

        // loop to distribute slideArr to each slide in pptx
        for (let i = 0; i < numberOfSlides; i++){
          var pptxLyricSlides = pptx.addNewSlide({ bkgd: '000000' });
          pptxLyricSlides.addText(slideArr[i+1], {x: 1.25, y: '3%', font_size: 30, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'top'});
        };
      };
  // ===== end of reformatSlides function =====
};
window.slides = function () {
    // update button to give user feedback
    document.getElementById("slidesProgress").innerHTML = "Creating File..."
    // set up input arrays from HTML side
    var numberOfSongs = 4;
    var titleArr = [];
    var artistArr = [];
    var lyricsArr = [];
    // read in all title, artist, and lyric inputs from HTML side & make title case
    for (let i = 1; i < numberOfSongs+1; i++){
      titleArr[i-1] = toTitleCase(document.getElementById("title"+i).value);
      artistArr[i-1] = toTitleCase(document.getElementById("artist"+i).value);
      lyricsArr[i-1] = document.getElementById("lyrics"+i).value;
    };

    // create PPT variable
    var pptx = new PptxGenJS();
    // reformat each input using reformatSlides function
    for (let i = 0; i < numberOfSongs; i++){
      reformatSlides(pptx, titleArr[i], artistArr[i], lyricsArr[i]);
    };

    // save & download pptx
    pptx.save('Lyrics Slideshow');
    // change user feedback button back to normal
    document.getElementById("slidesProgress").innerHTML = "Lyric Slideshow"
  };

// =================================================================================================
// ===================================== MUSICIAN CHORDS (PDF) =====================================
// =================================================================================================
function reformatChords(doc, songName, songArtist, songLyrics){
  // Reformat input with REGEX
  // var songLyrics ="Cornerstone by Hillsong\n\n[Intro]\n\n[ch]C[\/ch]   [ch]Am[\/ch]   [ch]F[\/ch]  [ch]G[\/ch]\n\n\n[Verse 1]\n\n[ch]C[\/ch]\nMy hope is built on nothing less\n[ch]F[\/ch]                     [ch]G[\/ch]\nThan Jesus\' blood and righteousness\n[ch]Am[\/ch]"
  // remove song intro text
  // var songLyrics2 = songLyrics.replace(/".+[\s\S].+.[\s\S].+.[\s\S].+.[\s\S]/gm, "");
  // remove Ð
  // var songLyrics3 = songLyrics2.replace(/\n\n\n/gm, "\n");
  // var songLyrics6 = songLyrics3.replace(/\n\n/gm, "\n");
  // remove [ch] & [/ch]
  var songLyrics_v1 = songLyrics.replace(/\[ch\]/gm, "");
  var songLyrics_v2 = songLyrics_v1.replace(/\[\/ch\]/gm, "");
  //remove Ð
  var songLyrics_v3 = songLyrics_v2.replace(/\r\n/gm, "\n");
  // remove end of song " mark
  // var songLyrics7 = songLyrics6.replace(/"/gm, "");
  // remove riff tabs (if present)
  // var songLyrics9 = songLyrics7.replace(/.\|-.*/gm, "");
  // remove extra spaces & blank lines
  // var songLyrics9 = songLyrics8.replace(/\r?\n\s*\n/gm, "\r\n");

  // Create pages
  doc.addPage({
    layout: 'landscape',
    margin: 25,
  });
    doc.font('Courier-Bold');
    doc.fontSize(13);
    doc.text(songName + " - " + songArtist, {
      columns: 2,
    });
      doc.moveDown();
        doc.font('Courier');
        doc.fontSize(12);
        doc.text(songLyrics_v3, {
          columns: 2,
        });
  // ===== end of reformatChords function =====
};
window.chords = function () {
  // update button to give user feedback
  document.getElementById("chordsProgress").innerHTML = "Creating File..."
  // set up input arrays from HTML side
  var numberOfSongs = 4;
  var titleArr = [];
  var artistArr = [];
  var lyricsArr = [];
  // read in all title, artist, and lyric inputs from HTML side & make title case
  for (let i = 1; i < numberOfSongs+1; i++){
    titleArr[i-1] = toTitleCase(document.getElementById("title"+i).value);
    artistArr[i-1] = toTitleCase(document.getElementById("artist"+i).value);
    lyricsArr[i-1] = document.getElementById("lyrics"+i).value;
  };

  // create blank PDF document
  var doc = new PDFDocument({
      autoFirstPage: false,
      // layout: 'landscape',
      margin: 25,
    });
  // change blank PDF document to a blob stream
  window.stream = doc.pipe(blobStream());

  // reformat each input using reformatChords
  for (let i = 0; i < numberOfSongs; i++){
      reformatChords(doc, titleArr[i], artistArr[i], lyricsArr[i]);
  };
  // save document
  doc.end();

  // downloader
  var filename = 'Musician Chords';
  stream.on('finish', function () {
    var pom = document.createElement('a');
    pom.setAttribute('href', stream.toBlobURL('application/pdf'));
    pom.setAttribute('download', filename);
    if (document.createEvent) {
      var event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
  })
  // change user feedback button back to normal
  document.getElementById("chordsProgress").innerHTML = "Musician Chords"
};

// =================================================================================================
// ===================================== LYRIC HANDOUT (PDF) =======================================
// =================================================================================================
function reformatHandout(doc, songName, songArtist, songLyrics){
  //remove chords
    var songLyrics_v1 = songLyrics.replace(/(\[ch\].*\[*c*h*\])/gm, "");
  //remove song intro text
    var songLyrics_v2 = songLyrics_v1.replace(/".+[\s\S].+.[\s\S].+.[\s\S].+.[\s\S]/gm, "");
  //remove end of song " mark
    var songLyrics_v3 = songLyrics_v2.replace(/"/gm, "");
  //remove riff tabs (if present)
    var songLyrics_v4 = songLyrics_v3.replace(/.\|-.*/gm, "");
  //remove [solo] & [instrumental]
    var songLyrics_v5 = songLyrics_v4.replace(/\[Solo\]|\[solo\]|\[Instrumental\]|\[instrumental\]/gm, "");
  //remove Ð
    var songLyrics_v6 = songLyrics_v5.replace(/\r\n/gm, "\n");
  //remove Ð attempt
    // var input7 = input6.replace(/\n\n\n/gm, "\n");
    // var songLyrics_v6 = input7.replace(/\n\n/gm, "\n");

  // Page Creation
    // doc.addPage({
    // layout: 'landscape',
    //   margin: 25,
    // });
    doc.font('Courier-Bold');
    doc.fontSize(13);
    doc.text(songName + " - " + songArtist, {
      columns: 1,
    });
      doc.moveDown();
        doc.font('Courier');
        doc.fontSize(12);
        doc.text(songLyrics_v6, {
          columns: 1,
        });
        doc.moveDown();
        // ===== end of reformatHandout function =====
    };
window.handout = function () {
  // update button to give user feedback
  document.getElementById("handoutProgress").innerHTML = "Creating File..."
  // set up input arrays from HTML side
  var numberOfSongs = 4;
  var titleArr = [];
  var artistArr = [];
  var lyricsArr = [];
  // read in all title, artist, and lyric inputs from HTML side & make title case
  for (let i = 1; i < numberOfSongs+1; i++){
    titleArr[i-1] = toTitleCase(document.getElementById("title"+i).value);
    artistArr[i-1] = toTitleCase(document.getElementById("artist"+i).value);
    lyricsArr[i-1] = document.getElementById("lyrics"+i).value;
  };

  // create blank PDF document
  var doc = new PDFDocument({
    // autoFirstPage: false,
    // layout: 'landscape',
    margin: 25,
  });
  // change blank PDF document to a blob stream
  window.stream = doc.pipe(blobStream());

  // reformat each input using reformatHandout
  for (let i = 0; i < numberOfSongs; i++){
      reformatHandout(doc, titleArr[i], artistArr[i], lyricsArr[i]);
  };
  // save document
  doc.end();

  // downloader
  var filename = 'Lyric Handout';
  stream.on('finish', function () {
    var pom = document.createElement('a');
    pom.setAttribute('href', stream.toBlobURL('application/pdf'));
    pom.setAttribute('download', filename);
    if (document.createEvent) {
      var event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
  })
    // change user feedback button back to normal
    document.getElementById("handoutProgress").innerHTML = "Lyric Handout"
};


// =================================================================================================
// ===================================== LYRICS ON PAPER (DOC) TEST???? ============================
// =================================================================================================
window.test = function () {

  var filename = 'Lyrics on Paper';
  // inputs
    var title1 = document.getElementById("title1").value;
    var chordsInput1 = document.getElementById("chords1").value;
    var title2 = document.getElementById("title2").value;
    var chordsInput2 = document.getElementById("chords2").value;
    var title3 = document.getElementById("title3").value;
    var chordsInput3 = document.getElementById("chords3").value;

  //SONG ONE!!!!!!!!!!!!

    //remove chords
      var chordsInput1_v2 = chordsInput1.replace(/\b([CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m)*[\d\/]*(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m)*[\d\/]*)*)(?=\s|$)(?!\w)/gm, "");
    //remove blank lines where chords used to be
      var chordsInput1_v3 = chordsInput1_v2.replace(/^\s*[\r\n]*/gm, "");
    //add a marker at the end of the input so the following code can find the last slide
      var chordsInput1_v4 = chordsInput1_v3 + "[";
    //find where to split slides
      var slideOneStart1 = chordsInput1_v4.indexOf("[");
      var slideTwoStart1 = chordsInput1_v4.indexOf("[", slideOneStart1 + 1);
      var slideThreeStart1 = chordsInput1_v4.indexOf("[", slideTwoStart1 + 1);
      var slideFourStart1 = chordsInput1_v4.indexOf("[", slideThreeStart1 + 1);
      var slideFiveStart1 = chordsInput1_v4.indexOf("[", slideFourStart1 + 1);
      var slideSixStart1 = chordsInput1_v4.indexOf("[", slideFiveStart1 + 1);
      var slideSevenStart1 = chordsInput1_v4.indexOf("[", slideSixStart1 + 1);
      var slideEightStart1 = chordsInput1_v4.indexOf("[", slideSevenStart1 + 1);
      var slideNineStart1 = chordsInput1_v4.indexOf("[", slideEightStart1 + 1);
      var slideTenStart1 = chordsInput1_v4.indexOf("[", slideNineStart1 + 1);
      var slideElevenStart1 = chordsInput1_v4.indexOf("[", slideTenStart1 + 1);
      var slideTwelveStart1 = chordsInput1_v4.indexOf("[", slideElevenStart1 + 1);
      var slideThirteenStart1 = chordsInput1_v4.indexOf("[", slideTwelveStart1 + 1);
    //prevent error where it prints duplicate slides
       if (slideThreeStart1<0) {
         slideFourStart1 = -1
         slideFiveStart1 = -1
         slideSixStart1 = -1
         slideSevenStart1 = -1
         slideEightStart1 = -1
         slideNineStart1 = -1
         slideTenStart1 = -1
         slideElevenStart1 = -1
         slideTwelveStart1 = -1
         slideThirteenStart1 = -1
       }
       if (slideFourStart1<0) {
         slideFiveStart1 = -1
         slideSixStart1 = -1
         slideSevenStart1 = -1
         slideEightStart1 = -1
         slideNineStart1 = -1
         slideTenStart1 = -1
         slideElevenStart1 = -1
         slideTwelveStart1 = -1
         slideThirteenStart1 = -1
       }
       if (slideFiveStart1<0) {
         slideSixStart1 = -1
         slideSevenStart1 = -1
         slideEightStart1 = -1
         slideNineStart1 = -1
         slideTenStart1 = -1
         slideElevenStart1 = -1
         slideTwelveStart1 = -1
         slideThirteenStart1 = -1
       }
       if (slideSixStart1<0) {
         slideSevenStart1 = -1
         slideEightStart1 = -1
         slideNineStart1 = -1
         slideTenStart1 = -1
         slideElevenStart1 = -1
         slideTwelveStart1 = -1
         slideThirteenStart1 = -1
       }
       if (slideSevenStart1<0) {
         slideEightStart1 = -1
         slideNineStart1 = -1
         slideTenStart1 = -1
         slideElevenStart1 = -1
         slideTwelveStart1 = -1
         slideThirteenStart1 = -1
       }
       if (slideEightStart1<0) {
         slideNineStart1 = -1
         slideTenStart1 = -1
         slideElevenStart1 = -1
         slideTwelveStart1 = -1
         slideThirteenStart1 = -1
       }
       if (slideNineStart1<0) {
         slideTenStart1 = -1
         slideElevenStart1 = -1
         slideTwelveStart1 = -1
         slideThirteenStart1 = -1
       }
       if (slideTenStart1<0) {
         slideElevenStart1 = -1
         slideTwelveStart1 = -1
         slideThirteenStart1 = -1
       }
       if (slideElevenStart1<0) {
         slideTwelveStart1 = -1
         slideThirteenStart1 = -1
       }
       if (slideTwelveStart1<0) {
         slideThirteenStart1 = -1
       }

    //split slides
      var slideOneIsolated1 = chordsInput1_v4.slice(slideOneStart1, slideTwoStart1);
      var slideTwoIsolated1 = chordsInput1_v4.slice(slideTwoStart1, slideThreeStart1);
      var slideThreeIsolated1 = chordsInput1_v4.slice(slideThreeStart1, slideFourStart1);
      var slideFourIsolated1 = chordsInput1_v4.slice(slideFourStart1, slideFiveStart1);
      var slideFiveIsolated1 = chordsInput1_v4.slice(slideFiveStart1, slideSixStart1);
      var slideSixIsolated1 = chordsInput1_v4.slice(slideSixStart1, slideSevenStart1);
      var slideSevenIsolated1 = chordsInput1_v4.slice(slideSevenStart1, slideEightStart1);
      var slideEightIsolated1 = chordsInput1_v4.slice(slideEightStart1, slideNineStart1);
      var slideNineIsolated1 = chordsInput1_v4.slice(slideNineStart1, slideTenStart1);
      var slideTenIsolated1 = chordsInput1_v4.slice(slideTenStart1, slideElevenStart1);
      var slideElevenIsolated1 = chordsInput1_v4.slice(slideElevenStart1, slideTwelveStart1);
      var slideTwelveIsolated1 = chordsInput1_v4.slice(slideTwelveStart1, slideThirteenStart1);
    //trim white space
      var slideOne1 = slideOneIsolated1.trim();
      var slideTwo1 = slideTwoIsolated1.trim();
      var slideThree1 = slideThreeIsolated1.trim();
      var slideFour1 = slideFourIsolated1.trim();
      var slideFive1 = slideFiveIsolated1.trim();
      var slideSix1 = slideSixIsolated1.trim();
      var slideSeven1 = slideSevenIsolated1.trim();
      var slideEight1 = slideEightIsolated1.trim();
      var slideNine1 = slideNineIsolated1.trim();
      var slideTen1 = slideTenIsolated1.trim();
      var slideEleven1 = slideElevenIsolated1.trim();
      var slideTwelve1 = slideTwelveIsolated1.trim();


    //SONG TWO!!!!!!!!!!!

      //remove chords
        var chordsInput2_v2 = chordsInput2.replace(/\b([CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m)*[\d\/]*(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m)*[\d\/]*)*)(?=\s|$)(?!\w)/gm, "");
      //remove blank lines where chords used to be
        var chordsInput2_v3 = chordsInput2_v2.replace(/^\s*[\r\n]*/gm, "");
      //add a marker at the end of the input so the following code can find the last slide
        var chordsInput2_v4 = chordsInput2_v3 + "[";
      //find where to split slides
        var slideOneStart2 = chordsInput2_v4.indexOf("[");
        var slideTwoStart2 = chordsInput2_v4.indexOf("[", slideOneStart2 + 1);
        var slideThreeStart2 = chordsInput2_v4.indexOf("[", slideTwoStart2 + 1);
        var slideFourStart2 = chordsInput2_v4.indexOf("[", slideThreeStart2 + 1);
        var slideFiveStart2 = chordsInput2_v4.indexOf("[", slideFourStart2 + 1);
        var slideSixStart2 = chordsInput2_v4.indexOf("[", slideFiveStart2 + 1);
        var slideSevenStart2 = chordsInput2_v4.indexOf("[", slideSixStart2 + 1);
        var slideEightStart2 = chordsInput2_v4.indexOf("[", slideSevenStart2 + 1);
        var slideNineStart2 = chordsInput2_v4.indexOf("[", slideEightStart2 + 1);
        var slideTenStart2 = chordsInput2_v4.indexOf("[", slideNineStart2 + 1);
        var slideElevenStart2 = chordsInput2_v4.indexOf("[", slideTenStart2 + 1);
        var slideTwelveStart2 = chordsInput2_v4.indexOf("[", slideElevenStart2 + 1);
        var slideThirteenStart2 = chordsInput2_v4.indexOf("[", slideTwelveStart2 + 1);
      //prevent error where it prints duplicate slides
         if (slideThreeStart2<0) {
           slideFourStart2 = -1
           slideFiveStart2 = -1
           slideSixStart2 = -1
           slideSevenStart2 = -1
           slideEightStart2 = -1
           slideNineStart2 = -1
           slideTenStart2 = -1
           slideElevenStart2 = -1
           slideTwelveStart2 = -1
           slideThirteenStart2 = -1
         }
         if (slideFourStart2<0) {
           slideFiveStart2 = -1
           slideSixStart2 = -1
           slideSevenStart2 = -1
           slideEightStart2 = -1
           slideNineStart2 = -1
           slideTenStart2 = -1
           slideElevenStart2 = -1
           slideTwelveStart2 = -1
           slideThirteenStart2 = -1
         }
         if (slideFiveStart2<0) {
           slideSixStart2 = -1
           slideSevenStart2 = -1
           slideEightStart2 = -1
           slideNineStart2 = -1
           slideTenStart2 = -1
           slideElevenStart2 = -1
           slideTwelveStart2 = -1
           slideThirteenStart2 = -1
         }
         if (slideSixStart2<0) {
           slideSevenStart2 = -1
           slideEightStart2 = -1
           slideNineStart2 = -1
           slideTenStart2 = -1
           slideElevenStart2 = -1
           slideTwelveStart2 = -1
           slideThirteenStart2 = -1
         }
         if (slideSevenStart2<0) {
           slideEightStart2 = -1
           slideNineStart2 = -1
           slideTenStart2 = -1
           slideElevenStart2 = -1
           slideTwelveStart2 = -1
           slideThirteenStart2 = -1
         }
         if (slideEightStart2<0) {
           slideNineStart2 = -1
           slideTenStart2 = -1
           slideElevenStart2 = -1
           slideTwelveStart2 = -1
           slideThirteenStart2 = -1
         }
         if (slideNineStart2<0) {
           slideTenStart2 = -1
           slideElevenStart2 = -1
           slideTwelveStart2 = -1
           slideThirteenStart2 = -1
         }
         if (slideTenStart2<0) {
           slideElevenStart2 = -1
           slideTwelveStart2 = -1
           slideThirteenStart2 = -1
         }
         if (slideElevenStart2<0) {
           slideTwelveStart2 = -1
           slideThirteenStart2 = -1
         }
         if (slideTwelveStart2<0) {
           slideThirteenStart2 = -1
         }

      //split slides
        var slideOneIsolated2 = chordsInput2_v4.slice(slideOneStart2, slideTwoStart2);
        var slideTwoIsolated2 = chordsInput2_v4.slice(slideTwoStart2, slideThreeStart2);
        var slideThreeIsolated2 = chordsInput2_v4.slice(slideThreeStart2, slideFourStart2);
        var slideFourIsolated2 = chordsInput2_v4.slice(slideFourStart2, slideFiveStart2);
        var slideFiveIsolated2 = chordsInput2_v4.slice(slideFiveStart2, slideSixStart2);
        var slideSixIsolated2 = chordsInput2_v4.slice(slideSixStart2, slideSevenStart2);
        var slideSevenIsolated2 = chordsInput2_v4.slice(slideSevenStart2, slideEightStart2);
        var slideEightIsolated2 = chordsInput2_v4.slice(slideEightStart2, slideNineStart2);
        var slideNineIsolated2 = chordsInput2_v4.slice(slideNineStart2, slideTenStart2);
        var slideTenIsolated2 = chordsInput2_v4.slice(slideTenStart2, slideElevenStart2);
        var slideElevenIsolated2 = chordsInput2_v4.slice(slideElevenStart2, slideTwelveStart2);
        var slideTwelveIsolated2 = chordsInput2_v4.slice(slideTwelveStart2, slideThirteenStart2);
      //trim white space
        var slideOne2 = slideOneIsolated2.trim();
        var slideTwo2 = slideTwoIsolated2.trim();
        var slideThree2 = slideThreeIsolated2.trim();
        var slideFour2 = slideFourIsolated2.trim();
        var slideFive2 = slideFiveIsolated2.trim();
        var slideSix2 = slideSixIsolated2.trim();
        var slideSeven2 = slideSevenIsolated2.trim();
        var slideEight2 = slideEightIsolated2.trim();
        var slideNine2 = slideNineIsolated2.trim();
        var slideTen2 = slideTenIsolated2.trim();
        var slideEleven2 = slideElevenIsolated2.trim();
        var slideTwelve2 = slideTwelveIsolated2.trim();



      //SONG THREE!!!!!!!!!!!

      //remove chords
        var chordsInput3_v2 = chordsInput3.replace(/\b([CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m)*[\d\/]*(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m)*[\d\/]*)*)(?=\s|$)(?!\w)/gm, "");
      //remove blank lines where chords used to be
        var chordsInput3_v3 = chordsInput3_v2.replace(/^\s*[\r\n]*/gm, "");
      //add a marker at the end of the input so the following code can find the last slide
        var chordsInput3_v4 = chordsInput3_v3 + "[";
      //find where to split slides
        var slideOneStart3 = chordsInput3_v4.indexOf("[");
        var slideTwoStart3 = chordsInput3_v4.indexOf("[", slideOneStart3 + 1);
        var slideThreeStart3 = chordsInput3_v4.indexOf("[", slideTwoStart3 + 1);
        var slideFourStart3 = chordsInput3_v4.indexOf("[", slideThreeStart3 + 1);
        var slideFiveStart3 = chordsInput3_v4.indexOf("[", slideFourStart3 + 1);
        var slideSixStart3 = chordsInput3_v4.indexOf("[", slideFiveStart3 + 1);
        var slideSevenStart3 = chordsInput3_v4.indexOf("[", slideSixStart3 + 1);
        var slideEightStart3 = chordsInput3_v4.indexOf("[", slideSevenStart3 + 1);
        var slideNineStart3 = chordsInput3_v4.indexOf("[", slideEightStart3 + 1);
        var slideTenStart3 = chordsInput3_v4.indexOf("[", slideNineStart3 + 1);
        var slideElevenStart3 = chordsInput3_v4.indexOf("[", slideTenStart3 + 1);
        var slideTwelveStart3 = chordsInput3_v4.indexOf("[", slideElevenStart3 + 1);
        var slideThirteenStart3 = chordsInput3_v4.indexOf("[", slideTwelveStart3 + 1);
      //prevent error where it prints duplicate slides
         if (slideThreeStart3<0) {
           slideFourStart3 = -1
           slideFiveStart3 = -1
           slideSixStart3 = -1
           slideSevenStart3 = -1
           slideEightStart3 = -1
           slideNineStart3 = -1
           slideTenStart3 = -1
           slideElevenStart3 = -1
           slideTwelveStart3 = -1
           slideThirteenStart3 = -1
         }
         if (slideFourStart3<0) {
           slideFiveStart3 = -1
           slideSixStart3 = -1
           slideSevenStart3 = -1
           slideEightStart3 = -1
           slideNineStart3 = -1
           slideTenStart3 = -1
           slideElevenStart3 = -1
           slideTwelveStart3 = -1
           slideThirteenStart3 = -1
         }
         if (slideFiveStart3<0) {
           slideSixStart3 = -1
           slideSevenStart3 = -1
           slideEightStart3 = -1
           slideNineStart3 = -1
           slideTenStart3 = -1
           slideElevenStart3 = -1
           slideTwelveStart3 = -1
           slideThirteenStart3 = -1
         }
         if (slideSixStart3<0) {
           slideSevenStart3 = -1
           slideEightStart3 = -1
           slideNineStart3 = -1
           slideTenStart3 = -1
           slideElevenStart3 = -1
           slideTwelveStart3 = -1
           slideThirteenStart3 = -1
         }
         if (slideSevenStart3<0) {
           slideEightStart3 = -1
           slideNineStart3 = -1
           slideTenStart3 = -1
           slideElevenStart3 = -1
           slideTwelveStart3 = -1
           slideThirteenStart3 = -1
         }
         if (slideEightStart3<0) {
           slideNineStart3 = -1
           slideTenStart3 = -1
           slideElevenStart3 = -1
           slideTwelveStart3 = -1
           slideThirteenStart3 = -1
         }
         if (slideNineStart3<0) {
           slideTenStart3 = -1
           slideElevenStart3 = -1
           slideTwelveStart3 = -1
           slideThirteenStart3 = -1
         }
         if (slideTenStart3<0) {
           slideElevenStart3 = -1
           slideTwelveStart3 = -1
           slideThirteenStart3 = -1
         }
         if (slideElevenStart3<0) {
           slideTwelveStart3 = -1
           slideThirteenStart3 = -1
         }
         if (slideTwelveStart3<0) {
           slideThirteenStart3 = -1
         }

      //split slides
        var slideOneIsolated3 = chordsInput3_v4.slice(slideOneStart3, slideTwoStart3);
        var slideTwoIsolated3 = chordsInput3_v4.slice(slideTwoStart3, slideThreeStart3);
        var slideThreeIsolated3 = chordsInput3_v4.slice(slideThreeStart3, slideFourStart3);
        var slideFourIsolated3 = chordsInput3_v4.slice(slideFourStart3, slideFiveStart3);
        var slideFiveIsolated3 = chordsInput3_v4.slice(slideFiveStart3, slideSixStart3);
        var slideSixIsolated3 = chordsInput3_v4.slice(slideSixStart3, slideSevenStart3);
        var slideSevenIsolated3 = chordsInput3_v4.slice(slideSevenStart3, slideEightStart3);
        var slideEightIsolated3 = chordsInput3_v4.slice(slideEightStart3, slideNineStart3);
        var slideNineIsolated3 = chordsInput3_v4.slice(slideNineStart3, slideTenStart3);
        var slideTenIsolated3 = chordsInput3_v4.slice(slideTenStart3, slideElevenStart3);
        var slideElevenIsolated3 = chordsInput3_v4.slice(slideElevenStart3, slideTwelveStart3);
        var slideTwelveIsolated3 = chordsInput3_v4.slice(slideTwelveStart3, slideThirteenStart3);
      //trim white space
        var slideOne3 = slideOneIsolated3.trim();
        var slideTwo3 = slideTwoIsolated3.trim();
        var slideThree3 = slideThreeIsolated3.trim();
        var slideFour3 = slideFourIsolated3.trim();
        var slideFive3 = slideFiveIsolated3.trim();
        var slideSix3 = slideSixIsolated3.trim();
        var slideSeven3 = slideSevenIsolated3.trim();
        var slideEight3 = slideEightIsolated3.trim();
        var slideNine3 = slideNineIsolated3.trim();
        var slideTen3 = slideTenIsolated3.trim();
        var slideEleven3 = slideElevenIsolated3.trim();
        var slideTwelve3 = slideTwelveIsolated3.trim();



        var docx = require('docx');

        var doc = new docx.Document();
        var paragraph = new docx.Paragraph("Some cool text here.");
        var exporter = new docx.LocalPacker(doc);
        exporter.pack('My Document');



        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(doc));
        pom.setAttribute('download', exporter);
        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        }
        else {
            pom.click();
        }




        //
        //   Example ARRAY by Tylor
        //
        //   var pptx = new PptxGenJS();
        //   // now you get call your api for each title/artist and get the chords
        //   // but getSong returns a promise, which means it's ASYNCHRONOUS. You'll
        //   // want to get ALL of your chords before making the slideshow. You can send
        //   // all of your requests in parallel by calling all three and putting the promise
        //   // returned from each call into an array, like so:
        //   const chordsPromises = [
        //     getSong(title1, artist1),
        //     getSong(title2, artist2),
        //     getSong(title3, artist3),
        //     getSong(title4, artist4)
        //   ];
        //
        //   // then, you pass them to the Promise.all function
        //   return Promise.all(chordsPromises).then(function(chords) {
        //     chords.forEach(function(chordsInput, index) {
        //       if(index == 0){
        //         var titleIn = title1;
        //         var artistIn = artist1;
        //       } else if (index == 1){
        //         var titleIn = title2;
        //         var artistIn = artist2;
        //       } else if (index == 2){
        //         var titleIn = title3;
        //         var artistIn = artist3;
        //       } else {
        //         var titleIn = title4;
        //         var artistIn = artist4;
        //       }
        //       reformatSlides(pptx, titleIn, artistIn, chordsInput);
        //     });
        //   }).then(function() {
        //     pptx.save('Lyrics Slideshow');
        //     document.getElementById("slidesProgress").innerHTML = "Lyric Slideshow"
        //   }).catch(function(e) {
        //     console.error('Something terrible has happened!', e);
        //   });
        //
        // };






        //
        // const docx = require('docx');
        // const express = require('express');
        // const app = express();
        //
        //
        // app.get("/", (req, res) => {
        //     var doc = new docx.Document();
        //
        //     var paragraph = new docx.Paragraph("Hello World");
        //
        //     doc.addParagraph(paragraph);
        //     const expressPacker = new docx.ExpressPacker(doc, res);
        //     expressPacker.pack("Document");
        //     // response.end("Hello world!");
        // });








        //
        // const express = require('express');
        // const app = express();
        //
        // app.get('/', (req, res) => res.send('Hello World!'));
        //
        // app.listen(3000, () => console.log('Example app listening on port 3000!'));
















      // const docx = require('docx');
      //
      // //CREATE FILE
      //   var doc = new Document();
      //
      //
      //   var paragraph = new docx.Paragraph(title1);
      //   paragraph.addRun(new docx.TextRun(chordsInput1));
      //
      //   doc.addParagraph(paragraph);
      //
      //
      //   //export file
      //   var exporter = new docx.LocalPacker(doc);
      //   exporter.pack('My First Document');
      };
