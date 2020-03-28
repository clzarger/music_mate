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

// ===================================== PICK LINES FUNCTION =====================================
window.maxLinesPerSlide = 4; // set default maxLinesPerSlide to 4
window.pickLines = function (maxLinesInput) {
  // update dropdown name based on user selection
  document.getElementById("dropdownMenuLink").innerHTML = "Max lines per slide: " + document.getElementById(maxLinesInput).innerHTML;
  window.maxLinesPerSlide = maxLinesInput;
};


// =================================================================================================
// ===================================== LYRIC SLIDESHOW (PPT) =====================================
// =================================================================================================
function reformatSlides(pptx, songName, songArtist, songLyrics, maxLinesPerSlide) {
    // Reformat input with REGEX (potentially helpful regex:\n.*\n.*\n.*$)
      // remove chords (when I used ugs, just needed this and skipped the next two regex expressions)
      var songLyrics_v1 = songLyrics.replace(/(\[ch\].*\[*c*h*\])/gm, "");
        // remove chords
        var songLyrics_v2 = songLyrics_v1.replace(/\b([CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|add)*[\d\/]*(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|add)*[\d\/]*)*)(?=\s|$)(?!\w)/gm, "");
        // remove blank lines where chords used to be
        var songLyrics_v3 = songLyrics_v2.replace(/^\s*[\r\n]*/gm, "");
      // remove song intro text
      var songLyrics_v4 = songLyrics_v3.replace(/".+[\s\S].+.[\s\S].+.[\s\S].+.[\s\S]/gm, "");
      // remove end of song " mark
      var songLyrics_v5 = songLyrics_v4.replace(/"/gm, "");
      // remove riff tabs (if present)
      var songLyrics_v6 = songLyrics_v5.replace(/.\|-.*/gm, "");
      // remove [solo] & [instrumental]
      var songLyrics_v7 = songLyrics_v6.replace(/\[Solo\]|\[solo\]|\[Instrumental\]|\[instrumental\]/gm, "");
      // remove % & |
      var songLyrics_v8 = songLyrics_v7.replace(/\%*\|*/gm, "");
      // remove extra spaces & blank lines
      var songLyrics_regex_complete = songLyrics_v8.replace(/\r?\n\s*\n/gm, "\r\n");

    // find number of slides
      var numberOfSlides = (songLyrics_regex_complete.match(/\[/g) || []).length;

    // create arrays & first index (javascript arrays use 0 for the first entry. I set it to -1 & skip it)
      let slideStartIndicesArr = [-1];
      let slideArr_w_whitespace_headers = [-1];
      let slideArr_w_whitespace = [-1];
      let slideArr = [-1];

    // find slide start indices based on brackets (and store in array)
      for (let i = 0; i < numberOfSlides; i++){
        slideStartIndicesArr[i+1] = songLyrics_regex_complete.indexOf("[", slideStartIndicesArr[i] + 1)
      };  //i didn't put this loop in the next one because the isolate slides piece needs to have all indices ready

    // sort input lyrics into slides & cleanup
    for (let i = 0; i < numberOfSlides; i++){
      // isolate slide lyrics (separate slides based on indices)
      slideArr_w_whitespace_headers[i+1] = songLyrics_regex_complete.slice(slideStartIndicesArr[i+1], slideStartIndicesArr[i+2])
      // remove verse & chorus headers
      slideArr_w_whitespace[i+1] = slideArr_w_whitespace_headers[i+1].replace(/\[.*\]/g, "");
      // remove white space
      slideArr[i+1] = slideArr_w_whitespace[i+1].trim();
    };

    // *MAIN LOOP*
    // split up slides that have too many lines, loads in one slide at a time using: slideArr[i+1]
    for (let i = 0; i < numberOfSlides; i++){
      //debug
      // console.log('loop start (loading in one slide)');
      // find the number of new line characters ( "\n" )
      var numberOfNewLines = (slideArr[i+1].match(/\n/g) || []).length;
      // add one to find the actual number of lines (since the last line doesn't have a '\n', this step creates a more intuitive variable to work with)
      var numberOfLines = numberOfNewLines + 1;
      // CHANGE TO USER INPUT
      // var maxLinesPerSlide = 4;
      // split based on number of lines on the slide (if # of lines exceeds max, split it up)
      if (numberOfLines > maxLinesPerSlide) {
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
        var numberOfSlidesNeeded = Math.ceil(numberOfLines/maxLinesPerSlide);
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
    // remove blanks slides by removing empty elements in slideArr. 
    slideArr = slideArr.filter(item => item);
        
    //debug
    console.log('finished slide array', slideArr, '\n');

    // create blank pptx file
    pptx.setLayout('LAYOUT_4x3');

      if (isNaN('Title')) {
        // create title slide
        var pptxTitleSlide = pptx.addNewSlide({ bkgd: '000000' });
        pptxTitleSlide.addText(songName, {x: 1.25, y: 3.5, font_size: 40, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'middle'});
        pptxTitleSlide.addText(songArtist, {x: 1.25, y: 4.5, font_size: 20, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'middle'});

        // loop to distribute slideArr to each slide in pptx
        // the length of slideArr is the # of slides. minus 1 b/c I have a -1 in the 0th slot
        for (let i = 0; i < slideArr.length - 1; i++){
          var pptxLyricSlides = pptx.addNewSlide({ bkgd: '000000' });
          pptxLyricSlides.addText(slideArr[i+1], {x: 1.25, y: '3%', font_size: 30, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'top'});
        };
      };
  // ===== end of reformatSlides function =====
  // ==========================================
};
window.slides = function () {
    // update button to give user feedback
    document.getElementById("slidesProgress").innerHTML = "Creating File..."
    // set up input arrays to hold data from HTML side
    var numberOfSongs = 4;
    var titleArr = [];
    var artistArr = [];
    var lyricsArr = [];
    // get inputs from HTML side
    for (let i = 1; i < numberOfSongs+1; i++){
      titleArr[i-1] = toTitleCase(document.getElementById("title"+i).value);
      artistArr[i-1] = toTitleCase(document.getElementById("artist"+i).value);
      lyricsArr[i-1] = document.getElementById("lyrics"+i).value;
    };
    // var maxLinesPerSlide = 4;
    // TEMP
    // var maxLinesPerSlide = document.getElementById("maxLinesPerSlide").value;
    // if input lyrics for a song are blank, remove that element
    for (let i = 0; i < numberOfSongs; i++){
      if (lyricsArr[i] == "") {
        titleArr.splice(i, 1);
        artistArr.splice(i, 1);
        lyricsArr.splice(i, 1);
        numberOfSongs = numberOfSongs - 1;
        i = i - 1;
      };
    };

    // create PPT variable
    var pptx = new PptxGenJS();
    // reformat each input using reformatSlides function
    for (let i = 0; i < numberOfSongs; i++){
      reformatSlides(pptx, titleArr[i], artistArr[i], lyricsArr[i], maxLinesPerSlide);
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
  // ==========================================
};
window.chords = function () {
  // update button to give user feedback
  document.getElementById("chordsProgress").innerHTML = "Creating File..."
  // set up input arrays to hold data from HTML side
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
  // if input lyrics for a song are blank, remove that element
  for (let i = 0; i < numberOfSongs; i++){
    if (lyricsArr[i] == "") {
      titleArr.splice(i, 1);
      artistArr.splice(i, 1);
      lyricsArr.splice(i, 1);
      numberOfSongs = numberOfSongs - 1;
      i = i - 1;
    };
  };

  // create blank PDF document
  var doc = new PDFDocument({
      autoFirstPage: false,
      layout: 'landscape',
      margin: 25,
    });
  // change blank PDF document to a blob stream (add content after this call)
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
    // remove % & |
    var songLyrics_v8 = songLyrics_v7.replace(/\%*\|*/gm, "");
    //remove extra spaces & blank lines
    var songLyrics_regex_complete = songLyrics_v8.replace(/\r?\n\s*\n/gm, "\r\n");

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
        doc.text(songLyrics_regex_complete, {
          columns: 1,
        });
        doc.moveDown();
        // ===== end of reformatHandout function =====
        // ==========================================
    };
window.handout = function () {
  // update button to give user feedback
  document.getElementById("handoutProgress").innerHTML = "Creating File..."
  // set up input arrays to hold data from HTML side
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
  // if input lyrics for a song are blank, remove that element
  for (let i = 0; i < numberOfSongs; i++){
    if (lyricsArr[i] == "") {
      titleArr.splice(i, 1);
      artistArr.splice(i, 1);
      lyricsArr.splice(i, 1);
      numberOfSongs = numberOfSongs - 1;
      i = i - 1;
    };
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
window.doc = function () {
  var docx = require('docx');
  var doc = new docx.Document();
  var paragraph = new docx.Paragraph("Some cool text here.");
  var exporter = new docx.LocalPacker(doc);
  exporter.pack('My Document');
      };
