/* eslint-disable */
// lyric handout pdf script

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

// ===== LOOPED OVER BY MAIN FUNCTION =====
function reformatHandout(doc, songName, songArtist, songLyrics){
  // Reformat input with REGEX (potentially helpful regex:\n.*\n.*\n.*$)
    // remove chords (when I used ugs, just needed this and skipped the next two regex expressions)
    var songLyrics_v1 = songLyrics.replace(/(\[ch\].*\[*c*h*\])/gm, "");
    // remove chords
    var songLyrics_v2 = songLyrics_v1.replace(/\b([CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|add)*[\d\/]*(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|add)*[\d\/]*)*)(?=\s|$)(?!\w)/gm, "");
    // remove N.C. (no chord)
    var songLyrics_v3 = songLyrics_v2.replace(/N\.C\./gm,"");
    // remove blank lines where chords used to be
    var songLyrics_v4 = songLyrics_v3.replace(/^\s*[\r\n]*/gm, "");
      // remove song intro text
      // var songLyrics_v4 = songLyrics_v3.replace(/".+[\s\S].+.[\s\S].+.[\s\S].+.[\s\S]/gm, "");
      // remove end of song " mark
      // var songLyrics_v5 = songLyrics_v4.replace(/"/gm, "");
    // remove riff tabs (if present)
    var songLyrics_v6 = songLyrics_v4.replace(/.\|-.*/gm, "");
    // remove [solo] & [instrumental]
    var songLyrics_v7 = songLyrics_v6.replace(/\[Solo\]|\[solo\]|\[Instrumental\]|\[instrumental\]/gm, "");
    // remove % & |
    var songLyrics_v8 = songLyrics_v7.replace(/\%*\|*/gm, "");
    // remove extra spaces & blank lines
    var songLyrics_v9 = songLyrics_v8.replace(/\r?\n\s*\n/gm, "\r\n");
    //remove Ð
    var songLyrics_regex_complete = songLyrics_v9.replace(/\r\n/gm, "\n");


  // split the text into an array by new line
  var songLyrics_SplitByNewline_Arr = songLyrics_regex_complete.split(/\n/g);

  // Page Creation
  doc.font('Courier-Bold');
  doc.fontSize(13);
  doc.text(songName + " - " + songArtist, {
    columns: 1, //this value doesn't seem to matter (I think b/c it's just the header)
  });
    doc.moveDown();
    doc.fontSize(12);
    // loop through the array of input text and bold lines with chords & brackets "["
    for (let i = 0; i < songLyrics_SplitByNewline_Arr.length; i++){
      // identifies all chords & lines with brackets "[" & makes them bold
      if (/\b([CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|add)*[\d\/]*(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|add)*[\d\/]*)*)(?=\s|$)(?!\w)|\[/gm.test(songLyrics_SplitByNewline_Arr[i])) {
        doc.font('Courier-Bold');
        doc.text(songLyrics_SplitByNewline_Arr[i], {
          columns: 1,
        });
      // leaves lyric text not bold
      } else {
        doc.font('Courier');
        doc.text(songLyrics_SplitByNewline_Arr[i], {
          columns: 1,
        });
      };
    };
      doc.moveDown();
      // ===== end of reformatHandout function =====
      // ==========
  };


// ===== MAIN FUNCTION ====
window.handout = function () {
  // update button to give user feedback
  document.getElementById("handoutProgress").innerHTML = "Creating File..."
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

  // pick filename
  if (numberOfSongs == 1 && titleArr[0] !== "Title" && artistArr[0] !== "Artist") {
    var filename = ('Lyric Handout ' + '(' + titleArr[0] + ' - ' + artistArr[0] + ')');
  } else {
    var filename = 'Lyric Handout';
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
    document.getElementById("handoutProgress").innerHTML = "Lyric Handout"
};