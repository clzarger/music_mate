/* eslint-disable */
// musician chords pdf script

// ===== NODE PACKAGES =====
const PDFDocument = require('./lib/pdfkit.standalone.js');
const blobStream = require('blob-stream');


// ===== UTILITY FUNCTIONS =====
// --- TITLE CASE FUNCTION ---
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// --- PICK COLUMNS FUNCTION --- for musician chords (pdf)
window.numberOfColumns = 2; // set default number of columns
window.pickColumns = function(numberOfColumnsInput) {
  // update dropdown name based on user selection
  document.getElementById("dropdownMenuPickColumns").innerHTML = "Number of columns: " + document.getElementById(numberOfColumnsInput).innerHTML;
  // update global variable for usage in main functions
  window.numberOfColumns = numberOfColumnsInput;
};

// --- PICK LAYOUT FUNCTION --- for musician chords (pdf)
window.pageLayout = 'landscape'; // set default page layout
window.pickLayout= function(pageLayoutInput) {
  // update dropdown name based on user selection
  document.getElementById("dropdownMenuPickLayout").innerHTML = "Page layout: " + document.getElementById(pageLayoutInput).innerHTML;
  // update global variable for usage in main functions
  window.pageLayout = pageLayoutInput;
};

// --- PICK FONT FUNCTION --- for musician chords (pdf)
window.fontSizeChords = 12; // set default font size
window.pickFontChords= function(fontSizeChordsInput) {
  // update dropdown name based on user selection
  document.getElementById("dropdownMenuPickFontChords").innerHTML = "Font size: " + document.getElementById(fontSizeChordsInput).innerHTML;
  // update global variable for usage in main functions
  window.fontSizeChords = fontSizeChordsInput;
};


// ===== LOOPED OVER BY MAIN FUNCTION =====
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
    var songLyrics_v4 = songLyrics_v3.replace(/\r?\n\s*\n/gm, "\r\n");
    //remove Ð
    var songLyrics_regex_complete = songLyrics_v4.replace(/\r\n/gm, "\n");


  // split the text into an array by new line
  var songLyrics_SplitByNewline_Arr = songLyrics_regex_complete.split(/\n/g);


    // create pages
    doc.addPage({
      // this seems to only affect the first page inserted
      layout: pageLayout,
      margin: 25,
    });
    // insert title & artist information
    doc.font('Courier-Bold');
    doc.fontSize(fontSizeChords + 1);
    doc.text(songName + " - " + songArtist, {
      columns: numberOfColumns, //this value doesn't seem to matter (I think b/c it's just the header)

    });
    // insert lyric information
    doc.moveDown();
    doc.fontSize(fontSizeChords);
    doc.font('Courier');
    // if only 1 column is requested, run code that does bolding properly
    if (numberOfColumns == 1) {
      // loop through the array of input text and bold lines with chords & brackets "["
      for (let i = 0; i < songLyrics_SplitByNewline_Arr.length; i++){
        // if the line of text starts with the letter A, do not count it as a chord by accident
        if (/A /gm.test(songLyrics_SplitByNewline_Arr[i])) {
          doc.font('Courier');
          doc.text(songLyrics_SplitByNewline_Arr[i], {
            columns: numberOfColumns,
          });
        // identifies all chords & lines with brackets "[" & makes them bold
        } else if (/\b([CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|add)*[\d\/]*(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|add)*[\d\/]*)*)(?=\s|$)(?!\w)|\[/gm.test(songLyrics_SplitByNewline_Arr[i])) {
          doc.font('Courier-Bold');
          doc.text(songLyrics_SplitByNewline_Arr[i], {
            columns: numberOfColumns,
          });
        // leaves lyric text not bold
        } else {
          doc.font('Courier');
          doc.text(songLyrics_SplitByNewline_Arr[i], {
            columns: numberOfColumns,
          });
        };
      };
    // if 2 columns is requested, bolding code doesn't work, use simpler code
    } else {
    // Create pages
    doc.text(songLyrics_regex_complete, {
      columns: numberOfColumns,
    });
    };
  // ===== end of reformatChords function =====
  // ==========================================
};


// ===== MAIN FUNCTION =====
window.chords = function () {
  // update button to give user feedback
  document.getElementById("chordsProgress").innerHTML = "Creating File..."
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

  // create blank PDF document
  var doc = new PDFDocument({
      autoFirstPage: false, // setting things in here seems to do nothing
      layout: pageLayout, // this affects subsequent pages that each addPage overflows content to  (portrait or landscape)
    });
  // change blank PDF document to a blob stream (add content after this call)
  window.stream = doc.pipe(blobStream());

  // reformat each input using reformatChords (loop through arrays containing the inputs)
  for (let i = 0; i < numberOfSongs; i++){
    reformatChords(doc, titleArr[i], artistArr[i], lyricsArr[i]);
  };
  // save document
  doc.end();
  // pick filename (if only one song is input along with a title & artist, change filename to be the name of that song)
  if (numberOfSongs == 1 && titleArr[0] !== "Title" && artistArr[0] !== "Artist") {
    var filename = ('Musician Chords ' + '(' + titleArr[0] + ' - ' + artistArr[0] + ')');
  } else {
    var filename = 'Musician Chords';
  };

  // downloader
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