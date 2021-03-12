/* eslint-disable */
// lyric slideshow powerpoint script

// ===== NODE PACKAGES =====   *** I GOT IT TO WORK OUTSIDE OF MY SCRIPT. PPTX THAT IS, if i put it in the top in root.js ***
import _chunk from 'lodash/chunk';
import pptxgen from 'pptxgenjs';
// const pptxgen = require('./lib/pptxgen.bundle.js');

// ===== UTILITY FUNCTIONS =====
// --- TITLE CASE FUNCTION ---
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// --- PICK LINES FUNCTION ---
window.maxLinesPerSlide = 4; // set default maxLinesPerSlide
window.pickLines = function(maxLinesInput) {
  // update dropdown name based on user selection
  document.getElementById("dropdownMenuPickLines").innerHTML = "Max lines per slide: " + document.getElementById(maxLinesInput).innerHTML;
  // update global variable for usage in main functions
  window.maxLinesPerSlide = maxLinesInput;
};

// --- PICK FONT FUNCTION ---
window.fontSizeSlideshow = 28; // set default font size
window.pickFontSlideshow = function(fontSizeSlideshowInput) {
  // update dropdown name based on user selection
  document.getElementById("dropdownMenuPickFontSlideshow").innerHTML = "Font size: " + document.getElementById(fontSizeSlideshowInput).innerHTML;
  // update global variable for usage in main functions
  window.fontSizeSlideshow = fontSizeSlideshowInput;
};


// ===== LOOPED OVER BY MAIN FUNCTION =====
function reformatSlides(pres, songName, songArtist, songLyrics, maxLinesPerSlide) {
  // Reformat input with REGEX (potentially helpful regex:\n.*\n.*\n.*$)
    // remove chords (when I used ugs, just needed this and skipped the next two regex expressions)
    var songLyrics_v1 = songLyrics.replace(/(\[ch\].*\[*c*h*\])/gm, "");
        // replace lines of lyrics that start with "A " (ie "A troublesome lyric") with a placeholder so they aren't accidentally removed by the next regex statement
        // The "remove chords" statement was grabbed from the internet and I don't totally understand it)
        // var songLyrics_v2 = songLyrics_v1.replace(/A ?/gm, "placeholdertextthatslongandwillalwaysbeunique");
    // remove chords
    var songLyrics_v4 = songLyrics_v1.replace(/\b([CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|add)*[\d\/]*(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|add)*[\d\/]*)*)(?=\s|$)(?!\w)/gm, "");
        // change placeholder text back to "A "
        // var songLyrics_v4 = songLyrics_v3.replace(/placeholdertextthatslongandwillalwaysbeunique/gm, "A ");
    // remove N.C. (no chord)
    var songLyrics_v5 = songLyrics_v4.replace(/N\.C\./gm,"");
    // remove blank lines where chords used to be
    var songLyrics_v6 = songLyrics_v5.replace(/^\s*[\r\n]*/gm, "");
      // remove song intro text
      // var songLyrics_v4 = songLyrics_v3.replace(/".+[\s\S].+.[\s\S].+.[\s\S].+.[\s\S]/gm, "");
      // remove end of song " mark
      // var songLyrics_v5 = songLyrics_v4.replace(/"/gm, "");
    // remove riff tabs (if present)
    var songLyrics_v7 = songLyrics_v6.replace(/.\|-.*/gm, "");
    // remove [solo] & [instrumental]
    var songLyrics_v8 = songLyrics_v7.replace(/\[Solo\]|\[solo\]|\[Instrumental\]|\[instrumental\]/gm, "");
    // remove % & |
    var songLyrics_v9 = songLyrics_v8.replace(/\%*\|*/gm, "");
    // remove extra spaces & blank lines
    var songLyrics_regex_complete = songLyrics_v9.replace(/\r?\n\s*\n/gm, "\r\n");

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

    // FIX THIS. Right here...I have my slideArr, which is an array where each elements is a slide.
    // I need to take each element in it and chop up lines that are too long. aka add more elements
    // that can hold the too long lines. THEN my next code can execute, which divides up those
    // logically split slides into furhter sub slides if there are too many lines per slide.
    // If I use a fixed width font, I can set some number of characters as a limit to split by.

    // *MAIN LOOP*
    // split up slides that have too many lines, loads in one slide at a time using: slideArr[i+1]
    for (let i = 0; i < numberOfSlides; i++){
      //debug
      // console.log('loop start (loading in one slide)');
      // find the number of new line characters ( "\n" )
      var numberOfNewLines = (slideArr[i+1].match(/\n/g) || []).length;
      // add one to find the actual number of lines (since the last line doesn't have a '\n', this step creates a more intuitive variable to work with)
      var numberOfLines = numberOfNewLines + 1;
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
        // find # of slides needed by dividing number of lines by selected maxLinesPerSlide, then taking the ceiling
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
    // console.log('finished slide array', slideArr, '\n');

    // create blank pptx file
    pres.layout = 'LAYOUT_4x3';

      if (isNaN('Title')) {
        // create title slide
        let titleSlide = pres.addSlide();
        // set background color
        titleSlide.background = { fill: '000000' };
        // add song name
        titleSlide.addText(songName, { x:0.25, y:3.25, w:'95%', fontFace: 'Helvetica', fontSize: 40, color:'ffffff', align: 'center', valign: 'middle' });
        // add song artist
        titleSlide.addText(songArtist, { x:0.25, y:4.25, w:'95%', fontFace: 'Helvetica', fontSize: 20, color:'ffffff', align: 'center', valign: 'middle' });
        // loop to distribute slideArr to each slide in pptx
        // the length of slideArr is the # of slides. minus 1 b/c I have a -1 in the 0th slot
        for (let i = 0; i < slideArr.length - 1; i++){
          let lyricSlide = pres.addSlide();
          lyricSlide.background = { fill: '000000' };
          lyricSlide.addText(slideArr[i+1], { h:6.0, x: 0.25, y: '2%', w:'95%', fontFace: 'Helvetica', fontSize: fontSizeSlideshow, color: 'ffffff', align: 'center', valign: 'top'});
        };
      };
  // ===== end of reformatSlides function =====
  // ==========================================
};


// ===== MAIN FUNCTION =====
window.slides = function () {
  // update button to give user feedback
  document.getElementById("slidesProgress").innerHTML = "Creating File..."
  // set up input arrays to hold data from HTML side
  var numberOfSongs = 4;
  var titleArr = [];
  var artistArr = [];
  var lyricsArr = [];
  // get inputs from HTML side, put into arrays
  for (let i = 0; i < numberOfSongs; i++){
    titleArr[i] = toTitleCase(document.getElementById("title"+i).value);
    artistArr[i] = toTitleCase(document.getElementById("artist"+i).value);
    lyricsArr[i] = document.getElementById("lyrics"+i).value;
  };
  // if user inputs nothing, add a placeholder slide (DATA VALIDATION) (This if statement is dumb, but I couldn't think of a clean way)
    if (titleArr[0]=="" && titleArr[1]=="" && titleArr[2]=="" && titleArr[3]=="" && artistArr[0]=="" && artistArr[1]=="" && artistArr[2]=="" && artistArr[3]=="" && lyricsArr[0]=="" && lyricsArr[1]=="" && lyricsArr[2]=="" && lyricsArr[3]=="") {
      titleArr[0] = "Title";
      artistArr[0] = "Artist";
      lyricsArr[0] = "[]Song Lyrics";
    };
  // if all inputs for a song are blank, remove that element (DATA VALIDATION)
  for (let i = 0; i < numberOfSongs; i++){
    if (titleArr[i] == "" && artistArr[i] == "" && lyricsArr[i] == "") {
      titleArr.splice(i, 1);
      artistArr.splice(i, 1);
      lyricsArr.splice(i, 1);
      numberOfSongs = numberOfSongs - 1;
      i = i - 1;
    };
  };
  // if user doesn't input a title, add a placeholder (DATA VALIDATION)
  for (let i = 0; i < numberOfSongs; i++){
    if (titleArr[i] == "") {
      titleArr[i] = "Title";
    };
  };
  // if user doesn't input an artist, add a placeholder (DATA VALIDATION)
  for (let i = 0; i < numberOfSongs; i++){
    if (artistArr[i] == "") {
      artistArr[i] = "Artist";
    };
  };

  // create PPT variable
  var pres = new pptxgen();
  // reformat each input using reformatSlides function
  for (let i = 0; i < numberOfSongs; i++){
    reformatSlides(pres, titleArr[i], artistArr[i], lyricsArr[i], maxLinesPerSlide);
  };
  debugger;
  // save & download pptx
  if (numberOfSongs == 1 && titleArr[0] !== "Title" && artistArr[0] !== "Artist") {
    pres.writeFile('Lyric Slideshow ' + '(' + titleArr[0] + ' - ' + artistArr[0] + ')');
  } else {
    pres.writeFile('Lyric Slideshow');
  };

  // change user feedback button back to normal
  document.getElementById("slidesProgress").innerHTML = "Lyric Slideshow"
  };