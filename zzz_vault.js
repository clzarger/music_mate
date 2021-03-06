// === MUSICIAN CHORDS (PDF) code ===
// NOTES
// I was trying to get pdfkit to be able to insert text that would be able to have chords come in bold
// This code was sitting right before:
      // Create pages
      doc.addPage({

// CODE =====
  // function chunkArray(myArray, chunk_size){
  //   var index = 0;
  //   var arrayLength = myArray.length;
  //   var tempArray = [];
  //   for (index = 0; index < arrayLength; index += chunk_size) {
  //     // if (/\b([CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|add)*[\d\/]*(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|add)*[\d\/]*)*)(?=\s|$)(?!\w)|\[/gm.test(songLyrics_SplitByNewline_Arr)) {
  //       var myChunk = myArray.slice(index, index + chunk_size);
  //     // };
  //     // Do something if you want with the group
  //     tempArray.push(myChunk);
  //   };
  //   return tempArray;
  // };

  // // chunk into groups that are equal to the number of lines per slide
  // var chunkedArrayNew = chunkArray(songLyrics_SplitByNewline_Arr, 1);
  // // array to string function
  // function arrayToString(array) {
  //   var string = "";
  //   for (let j = 0; j < array.length; j++){
  //     var string = string + array[j] + '\n';
  //   };
  //   return string = string.slice(0, -1);
  // };
  // // convert arrays (so they can properly be added to the master slides aka slideArr)
  // // if you don't do this, it adds the array as a single element, which breaks things
  // var chunkedStringNew = [];
  // for (let k = 0; k < chunkedArrayNew.length; k++){
  //   chunkedStringNew[k] = arrayToString(chunkedArrayNew[k]);
  // };
  // // at current index, remove 0 elements, then add the text to that position
  // for (let l = 0; l < chunkedStringNew.length; l++){
  //   songLyrics_SplitByNewline_Arr.splice(i+1+l, 0, chunkedStringNew[l]);
  // };
  // // skip ahead of the two split slides I just inserted & remove the old combined one
  // songLyrics_SplitByNewline_Arr.splice(i+1+chunkedStringNew.length, 1);
  // debugger;

  // var songLyrics_PairedLines_Arr = [];
  // // split songLyrics_SplitByNewline_Arr into a new array that combines array elements
  // // that have both chords & lyrics 
  // for (let i = 0; i < songLyrics_SplitByNewline_Arr.length; i++){
  //   if (/\b([CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|add)*[\d\/]*(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|add)*[\d\/]*)*)(?=\s|$)(?!\w)|\[/gm.test(songLyrics_SplitByNewline_Arr[i])) {
  //     var slicedOutTwoLines = songLyrics_SplitByNewline_Arr.slice(i, i + 2);
  //     songLyrics_PairedLines_Arr = songLyrics_PairedLines_Arr.push(slicedOutTwoLines);
  //   } else {
  //     songLyrics_PairedLines_Arr = songLyrics_PairedLines_Arr.push(songLyrics_SplitByNewline_Arr[i]);
  //   };
  // };

  // console.log(songLyrics_PairedLines_Arr);

  // then loop through the array & chunk too long ones into smaller bits (as I do in other code)
    // for (let i = 0; i < songLyrics_SplitByNewline_Arr.length; i++){
    //   var test = doc.widthOfString(songLyrics_SplitByNewline_Arr[i]);
    //   console.log(test);
    // };

    //THE CONCEPT:
    // split it up into an array that has chords tied with text, aka 2 lines per element
    // identify width of string, then split long lines into 2 elements if above a threshold
    // THEN do the normal split so that it can insert things in bold

    //THE ISSUE:
    // I can't take advantage of the built in 2 column functionality because you have to
    // insert all of the text at once so the package can tell when to wrap to 2 columns.
    // If I feed my text in this way, I won't be able to bold some lines

    //SOLUTION?
    // Build it into one doc, then put all of the sorted text from that one into another one?

    // END WORKING HERE

  // debugger;



// ===== CSS code of what buttons used to look like =====
// I took lines out that I found to be unnecessary
/* Button Sample */
.btn-sample {
  color: #FFFFFF;
  background-color: #F55E00;
  border-color: #FFFFFF;
}

.btn-sample:hover,
.btn-sample:focus,
.btn-sample:active,
.btn-sample.active,
.open .dropdown-toggle.btn-sample {
  color: #FFFFFF;
  background-color: #00304B;
  border-color: #FFFFFF;
}

.btn-sample:active,
.btn-sample.active,
.open .dropdown-toggle.btn-sample {
  background-image: none;
}

.btn-sample.disabled,
.btn-sample[disabled],
fieldset[disabled] .btn-sample,
.btn-sample.disabled:hover,
.btn-sample[disabled]:hover,
fieldset[disabled] .btn-sample:hover,
.btn-sample.disabled:focus,
.btn-sample[disabled]:focus,
fieldset[disabled] .btn-sample:focus,
.btn-sample.disabled:active,
.btn-sample[disabled]:active,
fieldset[disabled] .btn-sample:active,
.btn-sample.disabled.active,
.btn-sample[disabled].active,
fieldset[disabled] .btn-sample.active {
  background-color: #F55E00;
  border-color: #FFFFFF;
}

.btn-sample .badge {
  color: #F55E00;
  background-color: #FFFFFF;
}



// ===== GET INPUTS FUNCTION =====
function getInputs(numberOfSongs, titleArr, artistArr, lyricsArr) {
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
};


// ===== TEST FUNCTION for array =====
window.test = function () {
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


// ========= Musician Chords PDF ==========
  // // Create blank PDF document
  // var doc = new PDFDocument(
  //   {
  //     autoFirstPage: false,
  //     // layout: 'landscape',
  //     margin: 25,
  //   }
  // );
  //
  // // Change blank PDF document to a blob stream
  // window.stream = doc.pipe(blobStream());
  //
  // // Get song from Ultimate Guitar with "getSong" function
  // const chordsPromises = [
	// 	getSong(title1, artist1),
	// 	getSong(title2, artist2),
	// 	getSong(title3, artist3),
  //   getSong(title4, artist4)
	// ];
  //
  // // Use promise to loop through "reformatChords" function
	// return Promise.all(chordsPromises).then(function(chords) {
	// 	chords.forEach(function(chordsInput, index) {
  //     if(index == 0){
  //       var titleIn = title1;
  //       var artistIn = artist1;
  //     } else if (index == 1){
  //       var titleIn = title2;
  //       var artistIn = artist2;
  //     } else if (index == 2){
  //       var titleIn = title3;
  //       var artistIn = artist3;
  //     } else {
  //       var titleIn = title4;
  //       var artistIn = artist4;
  //     }
	// 		reformatChords(doc, titleIn, artistIn, chordsInput);
	// 	});
	// }).then(function() {
  //             doc.end();
  //
  //         // Downloader
  //         var filename = 'Musician Chords';
  //         stream.on('finish', function () {
  //           var pom = document.createElement('a');
  //           pom.setAttribute('href', stream.toBlobURL('application/pdf'));
  //           pom.setAttribute('download', filename);
  //           if (document.createEvent) {
  //               var event = document.createEvent('MouseEvents');
  //               event.initEvent('click', true, true);
  //               pom.dispatchEvent(event);
  //             }
  //             else {
  //                 pom.click();
  //             }
  //         })
  //
  //         // Return user feedback button change to normal
  //         document.getElementById("chordsProgress").innerHTML = "Musician Chords"
  //
  //         // Alert user if error
  //       	}).catch(function(e) {
  //       	console.error('Something terrible has happened!', e);
  //       });




// ====== lyric slideshow ppt. tylor's way to do the download with ASYNCHRONOUS promise =====
// // then, you pass them to the Promise.all function
// return Promise.all(lyricsArr).then(function(chords) {
// 	chords.forEach(function(lyricsIn, index) {
//     if(index == 0){
//       var titleIn = titleArr[0];
//       var artistIn = artistArr[0];
//     } else if (index == 1){
//       var titleIn = titleArr[1];
//       var artistIn = artistArr[1];
//     } else if (index == 2){
//       var titleIn = titleArr[2];
//       var artistIn = artistArr[2];
//     } else {
//       var titleIn = titleArr[3];
//       var artistIn = artistArr[3];
//     }
// 		reformatSlides(pptx, titleIn, artistIn, lyricsIn);
// 	});
// }).then(function() {
// 	pptx.save('Lyrics Slideshow');
//   document.getElementById("slidesProgress").innerHTML = "Lyric Slideshow"
// }).catch(function(e) {
// 	console.error('Something terrible has happened!', e);
// });


// ========= Pre Loop inputs from html side ==========
//   // song 1
//     var title1Raw = document.getElementById("title1").value;
//     var title1 = toTitleCase(title1Raw);
//     var artist1Raw = document.getElementById("artist1").value;
//     var artist1 = toTitleCase(artist1Raw);
//     var lyrics1 = document.getElementById("lyrics1").value;
//   // song 2
//     var title2Raw = document.getElementById("title2").value;
//     var title2 = toTitleCase(title2Raw);
//     var artist2Raw = document.getElementById("artist2").value;
//     var artist2 = toTitleCase(artist2Raw);
//     var lyrics2 = document.getElementById("lyrics2").value;
//   // song 3
//     var title3Raw = document.getElementById("title3").value;
//     var title3 = toTitleCase(title3Raw);
//     var artist3Raw = document.getElementById("artist3").value;
//     var artist3 = toTitleCase(artist3Raw);
//     var lyrics3 = document.getElementById("lyrics3").value;
//   // song 4
//     var title4Raw = document.getElementById("title4").value;
//     var title4 = toTitleCase(title4Raw);
//     var artist4Raw = document.getElementById("artist4").value;
//     var artist4 = toTitleCase(artist4Raw);
//     var lyrics4 = document.getElementById("lyrics4").value;



// ===== GET SONG DATA FROM SERVER =====
// was in header of root.js just under node packages
// function getSong(songName, songArtist){
//   return axios.get('https://eg5n058gdb.execute-api.us-east-1.amazonaws.com/dev/getSong?name=' + songName + '&artist=' + songArtist)
//     .then(response => {
//       return response.data.content.text;
//     });
// };


// =====================================
// ========== Array manipulation to split slides in to chunks ==========
// =====================================

// ===== example =====
// Array: [line 1, line 2, line 3, line 4, line 5, line 6]
// Index: [     0,      1,      2,      3,      4,      5]

// loop a number of times equal to how many times you need to break the slide apart
// this number is equal to the number of slides needed minus 1
for (let i = 0; i < numberOfSlidesNeeded - 1; i++){
  var half_length = Math.ceil(oneSlide_SplitByNewline_Arr.length / 2);
  var leftSideArr = oneSlide_SplitByNewline_Arr.splice(0,  );
  var rightSideArr = oneSlide_SplitByNewline_Arr;
};

var leftSideString = arrayToString(leftSideArr);
var rightSideString = arrayToString(rightSideArr);

// OLD
// break up the loaded slide into 2 parts
var half_length = Math.ceil(oneSlide_SplitByNewline_Arr.length / 2);
var leftSideArr = oneSlide_SplitByNewline_Arr.splice(0, half_length);
var rightSideArr = oneSlide_SplitByNewline_Arr;

//===== new way =====
var chunkArr = [-1];
while (oneSlide_SplitByNewline_Arr.length > 0) {   //keep splicing until it has no length
  var chunk = oneSlide_SplitByNewline_Arr.splice(0, 3);
  chunkArr.push(chunk);

  for (let j = 0; j < chunk.length; j++){
    console.log(chunk.length);
    // this adds each line as an element in the array. I want them to be added in chunks as an element to chunkArr
    chunkArr.push(chunk[j] + '\n');
  };

  // chunkArr.push(chunk[0] + '\n' + chunk[1] + '\n' + chunk[2]); // THIS WORKS, but I'm trying to rewrite it into a generalizable loop

};

//===== old way =====
var first3lines = oneSlide_SplitByNewline_Arr[0] + '\n' + oneSlide_SplitByNewline_Arr[1] + '\n' + oneSlide_SplitByNewline_Arr[2];
var last3lines = oneSlide_SplitByNewline_Arr[3] + '\n' + oneSlide_SplitByNewline_Arr[4] + '\n' + oneSlide_SplitByNewline_Arr[5];


//===== dumb but it works =====
// split
  if (numberOfLines == 7) {
    console.log('if statement triggered' + '\n');
    var oneSlide_SplitByNewline_Arr = slideArr[i+1].split(/\n/g);
    var first3lines = oneSlide_SplitByNewline_Arr[0] + '\n' + oneSlide_SplitByNewline_Arr[1] + '\n' + oneSlide_SplitByNewline_Arr[2] + '\n' + oneSlide_SplitByNewline_Arr[3];
    var last3lines = oneSlide_SplitByNewline_Arr[4] + '\n' + oneSlide_SplitByNewline_Arr[5] + '\n' + oneSlide_SplitByNewline_Arr[6];
    // at position 3, insert the excess lines (THESE 2 ARE CAUSING ISSUES)
    console.log('\n' + slideArr + '\n');
    // at current index, remove 0 elements, then add the text to that position
    slideArr.splice( i+1, 0, first3lines, last3lines );
    // skip ahead of the two split slides I just inserted & remove the old combined one
    slideArr.splice( i+3, 1);
    var numberOfSlides = numberOfSlides + 1;
  };

  // split
    if (numberOfLines == 8) {
      console.log('if statement triggered' + '\n');
      var oneSlide_SplitByNewline_Arr = slideArr[i+1].split(/\n/g);
      var first3lines = oneSlide_SplitByNewline_Arr[0] + '\n' + oneSlide_SplitByNewline_Arr[1] + '\n' + oneSlide_SplitByNewline_Arr[2] + '\n' + oneSlide_SplitByNewline_Arr[3];
      var last3lines = oneSlide_SplitByNewline_Arr[4] + '\n' + oneSlide_SplitByNewline_Arr[5] + '\n' + oneSlide_SplitByNewline_Arr[6] + '\n' + oneSlide_SplitByNewline_Arr[7];
      // at position 3, insert the excess lines (THESE 2 ARE CAUSING ISSUES)
      console.log('\n' + slideArr + '\n');
      // at current index, remove 0 elements, then add the text to that position
      slideArr.splice( i+1, 0, first3lines, last3lines );
      // skip ahead of the two split slides I just inserted & remove the old combined one
      slideArr.splice( i+3, 1);
      var numberOfSlides = numberOfSlides + 1;
    };







    // ===== CODE VAULT =====
      // How it used to be done
      //     //SONG ONE!!!!!!!!!!!!
      //       //remove chords
      //         var chordsInput1_v2 = chordsInput1.replace(/\b([CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m)*[\d\/]*(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m)*[\d\/]*)*)(?=\s|$)(?!\w)/gm, "");
      //       //remove blank lines where chords used to be
      //         var chordsInput1_v3 = chordsInput1_v2.replace(/^\s*[\r\n]*/gm, "");
      //
      //     //SONG TWO!!!!!!!!!!!
      //       //remove chords
      //         var chordsInput2_v2 = chordsInput2.replace(/\b([CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m)*[\d\/]*(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m)*[\d\/]*)*)(?=\s|$)(?!\w)/gm, "");
      //       //remove blank lines where chords used to be
      //         var chordsInput2_v3 = chordsInput2_v2.replace(/^\s*[\r\n]*/gm, "");
      //
      //     //SONG THREE!!!!!!!!!!!
      //       //remove chords
      //         var chordsInput3_v2 = chordsInput3.replace(/\b([CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m)*[\d\/]*(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m)*[\d\/]*)*)(?=\s|$)(?!\w)/gm, "");
      //       //remove blank lines where chords used to be
      //         var chordsInput3_v3 = chordsInput3_v2.replace(/^\s*[\r\n]*/gm, "");
      //
      //       //Combine
      //         var song = title1 + "\n" + chordsInput1_v3 + "\n\n" + title2 + "\n" + chordsInput2_v3 + "\n\n" +
      //           title3 + "\n" + chordsInput3_v3;

      //     // <!---PDF Generator-->

      //     // INSERT PAGE
      //     var doc = new PDFDocument({
      //       margin: 25,
      //     });
      //     window.stream = doc.pipe(blobStream());
      //     doc.font('Times-Roman');
      //
      //     doc.fontSize (11);
      //     doc.text(song, {
      //       align: 'left',
      //       columns: 2,
      //     });
      //
      //
      //
      //     doc.end();
      //     stream.on('finish', function () {
      //     // <!---downloader-->
      //     var pom = document.createElement('a');
      //     pom.setAttribute('href', stream.toBlobURL('application/pdf'));
      //     pom.setAttribute('download', filename);
      //     if (document.createEvent) {
      //         var event = document.createEvent('MouseEvents');
      //         event.initEvent('click', true, true);
      //         pom.dispatchEvent(event);
      //     }
      //     else {
      //         pom.click();
      //     }
      //   })
      // };

      // LYRICS ON SLIDES (PDF) - RETIRED
      // window.slides = function () {
      //     var filename = 'Slides';
      //     // inputs
      //     var title1 = document.getElementById("title1").value;
      //     var chordsInput1 = document.getElementById("chords1").value;
      //
      //     var title2 = document.getElementById("title2").value;
      //     var chordsInput2 = document.getElementById("chords2").value;
      //
      //     var title3 = document.getElementById("title3").value;
      //     var chordsInput3 = document.getElementById("chords3").value;
      //
      //     //reformat!!!!!!!!!!!!!!
      //
      //     //SONG ONE!!!!!!!!!!!!
      //     //remove chords
      //     var one1 = chordsInput1.replace(/Am\s|A\s|A#\s|A\/G|Bm\s|C\s|Dsus|G\s|E\s|Em\s|Em7\s|D\s|Dm\s|F\s|Cadd2|Cadd9|G\/D|D\/F#|G\/B|Dsus4|Am7|-|Am\/G|C\/E/g,"");
      //     var two1 = one1.replace(/^\s*[\r\n]*/gm,"");
      //     //var two = three.replace(/\[Intro]\n\s/,"");
      //     //find where to split slides
      //     var slideOneStart1 = two1.indexOf("[");
      //     var slideTwoStart1 = two1.indexOf("[",slideOneStart1+1);
      //     var slideThreeStart1 = two1.indexOf("[",slideTwoStart1+1);
      //     var slideFourStart1 = two1.indexOf("[",slideThreeStart1+1);
      //     var slideFiveStart1 = two1.indexOf("[",slideFourStart1+1);
      //     var slideSixStart1 = two1.indexOf("[",slideFiveStart1+1);
      //     var slideSevenStart1 = two1.indexOf("[",slideSixStart1+1);
      //     var slideEightStart1 = two1.indexOf("[",slideSevenStart1+1);
      //     var slideNineStart1 = two1.indexOf("[",slideEightStart1+1);
      //     //split slides
      //     var slideOnePre1 = two1.slice(slideOneStart1,slideTwoStart1);
      //     var slideTwoPre1 = two1.slice(slideTwoStart1,slideThreeStart1);
      //     var slideThreePre1 = two1.slice(slideThreeStart1,slideFourStart1);
      //     var slideFourPre1 = two1.slice(slideFourStart1,slideFiveStart1);
      //     var slideFivePre1 = two1.slice(slideFiveStart1,slideSixStart1);
      //     var slideSixPre1 = two1.slice(slideSixStart1,slideSevenStart1);
      //     var slideSevenPre1 = two1.slice(slideSevenStart1,slideEightStart1);
      //     var slideEightPre1 = two1.slice(slideEightStart1,slideNineStart1);
      //     //remove verse & chorus headers
      //     var slideOne1 = slideOnePre1.replace(/\[.*\]/g,"");
      //     var slideTwo1 = slideTwoPre1.replace(/\[.*\]/g,"");
      //     var slideThree1 = slideThreePre1.replace(/\[.*\]/g,"");
      //     var slideFour1 = slideFourPre1.replace(/\[.*\]/g,"");
      //     var slideFive1 = slideFivePre1.replace(/\[.*\]/g,"");
      //     var slideSix1 = slideSixPre1.replace(/\[.*\]/g,"");
      //     var slideSeven1 = slideSevenPre1.replace(/\[.*\]/g,"");
      //     var slideEight1 = slideEightPre1.replace(/\[.*\]/g,"");
      //
      //
      //     //SONG TWO!!!!!!!!!!!
      //
      //     //remove chords
      //     var one2 = chordsInput2.replace(/Am\s|A\s|A#\s|Bm\s|C\s|Dsus|G\s|E\s|Em\s|Em7\s|D\s|Dm\s|F\s|Cadd2|Cadd9|G\/D|D\/F#|G\/B|Dsus4|Am7|-|Am\/G|C\/E/g,"");
      //     var two2 = one2.replace(/^\s*[\r\n]*/gm,"");
      //     //var two = three.replace(/\[Intro]\n\s/,"");
      //     //find where to split slides
      //     var slideOneStart2 = two2.indexOf("[");
      //     var slideTwoStart2 = two2.indexOf("[",slideOneStart2+1);
      //     var slideThreeStart2 = two2.indexOf("[",slideTwoStart2+1);
      //     var slideFourStart2 = two2.indexOf("[",slideThreeStart2+1);
      //     var slideFiveStart2 = two2.indexOf("[",slideFourStart2+1);
      //     var slideSixStart2 = two2.indexOf("[",slideFiveStart2+1);
      //     var slideSevenStart2 = two2.indexOf("[",slideSixStart2+1);
      //     var slideEightStart2 = two2.indexOf("[",slideSevenStart2+1);
      //     var slideNineStart2 = two2.indexOf("[",slideEightStart2+1);
      //     //split slides
      //     var slideOnePre2 = two2.slice(slideOneStart2,slideTwoStart2);
      //     var slideTwoPre2 = two2.slice(slideTwoStart2,slideThreeStart2);
      //     var slideThreePre2 = two2.slice(slideThreeStart2,slideFourStart2);
      //     var slideFourPre2 = two2.slice(slideFourStart2,slideFiveStart2);
      //     var slideFivePre2 = two2.slice(slideFiveStart2,slideSixStart2);
      //     var slideSixPre2 = two2.slice(slideSixStart2,slideSevenStart2);
      //     var slideSevenPre2 = two2.slice(slideSevenStart2,slideEightStart2);
      //     var slideEightPre2 = two2.slice(slideEightStart2,slideNineStart2);
      //     //remove verse & chorus headers
      //     var slideOne2 = slideOnePre2.replace(/\[.*\]/g,"");
      //     var slideTwo2 = slideTwoPre2.replace(/\[.*\]/g,"");
      //     var slideThree2 = slideThreePre2.replace(/\[.*\]/g,"");
      //     var slideFour2 = slideFourPre2.replace(/\[.*\]/g,"");
      //     var slideFive2 = slideFivePre2.replace(/\[.*\]/g,"");
      //     var slideSix2 = slideSixPre2.replace(/\[.*\]/g,"");
      //     var slideSeven2 = slideSevenPre2.replace(/\[.*\]/g,"");
      //     var slideEight2 = slideEightPre2.replace(/\[.*\]/g,"");
      //
      //
      //
      //     //SONG THREE!!!!!!!!!!!
      //
      //     //remove chords
      //     var one3 = chordsInput3.replace(/Am\s|A\s|A#\s|Bm\s|C\s|Dsus|G\s|E\s|Em\s|Em7\s|D\s|Dm\s|F\s|Cadd2|Cadd9|G\/D|D\/F#|G\/B|Dsus4|Am7|-|Am\/G|C\/E/g,"");
      //     var two3 = one3.replace(/^\s*[\r\n]*/gm,"");
      //     //var two = three.replace(/\[Intro]\n\s/,"");
      //     //find where to split slides
      //     var slideOneStart3 = two3.indexOf("[");
      //     var slideTwoStart3 = two3.indexOf("[",slideOneStart3+1);
      //     var slideThreeStart3 = two3.indexOf("[",slideTwoStart3+1);
      //     var slideFourStart3 = two3.indexOf("[",slideThreeStart3+1);
      //     var slideFiveStart3 = two3.indexOf("[",slideFourStart3+1);
      //     var slideSixStart3 = two3.indexOf("[",slideFiveStart3+1);
      //     var slideSevenStart3 = two3.indexOf("[",slideSixStart3+1);
      //     var slideEightStart3 = two3.indexOf("[",slideSevenStart3+1);
      //     var slideNineStart3 = two3.indexOf("[",slideEightStart3+1);
      //     //split slides
      //     var slideOnePre3 = two3.slice(slideOneStart3,slideTwoStart3);
      //     var slideTwoPre3 = two3.slice(slideTwoStart3,slideThreeStart3);
      //     var slideThreePre3 = two3.slice(slideThreeStart3,slideFourStart3);
      //     var slideFourPre3 = two3.slice(slideFourStart3,slideFiveStart3);
      //     var slideFivePre3 = two3.slice(slideFiveStart3,slideSixStart3);
      //     var slideSixPre3 = two3.slice(slideSixStart3,slideSevenStart3);
      //     var slideSevenPre3 = two3.slice(slideSevenStart3,slideEightStart3);
      //     var slideEightPre3 = two3.slice(slideEightStart3,slideNineStart3);
      //     //remove verse & chorus headers
      //     var slideOne3 = slideOnePre3.replace(/\[.*\]/g,"");
      //     var slideTwo3 = slideTwoPre3.replace(/\[.*\]/g,"");
      //     var slideThree3 = slideThreePre3.replace(/\[.*\]/g,"");
      //     var slideFour3 = slideFourPre3.replace(/\[.*\]/g,"");
      //     var slideFive3 = slideFivePre3.replace(/\[.*\]/g,"");
      //     var slideSix3 = slideSixPre3.replace(/\[.*\]/g,"");
      //     var slideSeven3 = slideSevenPre3.replace(/\[.*\]/g,"");
      //     var slideEight3 = slideEightPre3.replace(/\[.*\]/g,"");
      //
      //
      //
      //     // page one
      //     var doc = new PDFDocument(
      //       {
      //         layout: 'landscape'
      //       }
      //     );
      //     window.stream = doc.pipe(blobStream());
      //     doc.font('Helvetica');
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //
      //     //title slide
      //     doc.fontSize(40).fillColor('white');
      //     doc.moveDown(4);
      //     doc.text(title1, {
      //       align: 'center',
      //     });
      //
      //
      //     //song one, slide one
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideOne1, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide two
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideTwo1, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide three
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideThree1, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide four
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideFour1, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide five
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideFive1, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide six
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideSix1, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide seven
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideSeven1, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide eight
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideEight1, {
      //       align: 'center',
      //     });
      //
      //     //SONG TWO!!!!!!!!
      //
      //     //song two title
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(40).fillColor('white');
      //     doc.moveDown(4)
      //     doc.text(title2, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide one
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideOne2, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide two
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideTwo2, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide three
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideThree2, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide four
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideFour2, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide five
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideFive2, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide six
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideSix2, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide seven
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideSeven2, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide eight
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideEight2, {
      //       align: 'center',
      //     });
      //
      //
      //
      //     //SONG THREE!!!!!!!!
      //
      //     //song two title
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(40).fillColor('white');
      //     doc.moveDown(4)
      //     doc.text(title3, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide one
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideOne3, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide two
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideTwo3, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide three
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideThree3, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide four
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideFour3, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide five
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideFive3, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide six
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideSix3, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide seven
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideSeven3, {
      //       align: 'center',
      //     });
      //
      //     //song one, slide eight
      //     doc.addPage();
      //     doc.rect(0,0,800,800);
      //     doc.fillAndStroke("black","#100");
      //     doc.fontSize(30).fillColor('white');
      //     doc.text(slideEight3, {
      //       align: 'center',
      //     });
      //
      //
      //
      //
      //
      //
      //     doc.end();
      //     stream.on('finish', function () {
      //     // <!---downloader-->
      //     var pom = document.createElement('a');
      //     pom.setAttribute('href', stream.toBlobURL('application/pdf'));
      //     pom.setAttribute('download', filename);
      //     if (document.createEvent) {
      //         var event = document.createEvent('MouseEvents');
      //         event.initEvent('click', true, true);
      //         pom.dispatchEvent(event);
      //     }
      //     else {
      //         pom.click();
      //     }
      //   })
      // };



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




      // =================================
      // ===== LYRICS ON PAPER (DOC) TEST???? ============================
      // =================================
      window.test = function () {
        var filename = 'Lyrics on Paper';
        // inputs
          var title1 = document.getElementById("title1").value;
          var chordsInput1 = document.getElementById("chords1").value;
          var title2 = document.getElementById("title2").value;
          var chordsInput2 = document.getElementById("chords2").value;
          var title3 = document.getElementById("title3").value;
          var chordsInput3 = document.getElementById("chords3").value;



          //remove chords
            var chordsInput1_v2 = chordsInput1.replace(/\b([CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m)*[\d\/]*(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m)*[\d\/]*)*)(?=\s|$)(?!\w)/gm, "");
          //remove blank lines where chords used to be
            var chordsInput1_v3 = chordsInput1_v2.replace(/^\s*[\r\n]*/gm, "");
          //add a marker at the end of the input so the following code can find the last slide
            var chordsInput1_v4 = chordsInput1_v3 + "[";


              var docx = require('docx');

              var doc = new docx.Document();
              var paragraph = new docx.Paragraph("Some cool text here.");
              var exporter = new docx.LocalPacker(doc);
              exporter.pack('My Document');

              // downloader
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
