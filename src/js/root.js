// ===================================== NODE PACKAGES =====================================
const temp = require('./temp');
const PDFDocument = require('pdfkit');
const blobStream = require('blob-stream');
const axios = require('axios');

// ===================================== GET SONG DATA FROM SERVER =====================================
function getSong(songName, songArtist){
  return axios.get('https://eg5n058gdb.execute-api.us-east-1.amazonaws.com/dev/getSong?name=' + songName + '&artist=' + songArtist)
    .then(response => {
      return response.data.content.text;
    });
};

// ===================================== TITLE CASE FUNCTION =====================================
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// ===================================== TEST FUNCTION =====================================
// window.loop = function () {
//   var chordsInput1_v4 = 'HEY THIS [1] text for the first slide [2] second slide [3] third one [4] fourth one [5] fifth';
//
//   // find number of slides
//   var numberOfSlides = (chordsInput1_v4.match(/\[/g) || []).length;
//
//   // Create array
//   let arrayOfSlideStartIndices = [];
//
//   // create first index
//   arrayOfSlideStartIndices[0] = -1;
//
//   // loop to find all indices & store in an array
//   for (let i = 0; i < numberOfSlides; i++){
//     arrayOfSlideStartIndices[i+1] = chordsInput1_v4.indexOf("[", arrayOfSlideStartIndices[i] + 1)
//   };
//
// // DEBUG
// console.log(arrayOfSlideStartIndices);
//
// };


// ===================================== MUSICIAN CHORDS (PDF) =====================================
function reformatChords(doc, songName, songArtist, input){

  // Reformat input with REGEX
    // var input ="Cornerstone by Hillsong\n\n[Intro]\n\n[ch]C[\/ch]   [ch]Am[\/ch]   [ch]F[\/ch]  [ch]G[\/ch]\n\n\n[Verse 1]\n\n[ch]C[\/ch]\nMy hope is built on nothing less\n[ch]F[\/ch]                     [ch]G[\/ch]\nThan Jesus\' blood and righteousness\n[ch]Am[\/ch]"
    // remove song intro text
    // var input2 = input.replace(/".+[\s\S].+.[\s\S].+.[\s\S].+.[\s\S]/gm, "");
    // remove Ð
    // var input3 = input2.replace(/\n\n\n/gm, "\n");
    // var input6 = input3.replace(/\n\n/gm, "\n");
    // remove [ch] & [/ch]
      var input2 = input.replace(/\[ch\]/gm, "");
      var input3 = input2.replace(/\[\/ch\]/gm, "");
    //remove Ð
      var input4 = input3.replace(/\r\n/gm, "\n");
    // remove end of song " mark
    // var input7 = input6.replace(/"/gm, "");
    // remove riff tabs (if present)
    // var input9 = input7.replace(/.\|-.*/gm, "");
    // remove extra spaces & blank lines
    // var input9 = input8.replace(/\r?\n\s*\n/gm, "\r\n");

  // Create pages
  doc.addPage({
    // layout: 'landscape',
    margin: 25,
  });
    doc.font('Courier-Bold');
    doc.fontSize(13);
    doc.text(songName + " - " + songArtist, {
      columns: 1,
    });
      doc.moveDown();
        doc.font('Courier');
        doc.fontSize(12);
        doc.text(input4, {
          columns: 1,
        });
    };
window.chords = function () {

  // Give user feedback
  document.getElementById("chordsProgress").innerHTML = "Creating File..."

  // Clean up user inputs
  var title1Raw = document.getElementById("name1").value;
    var title1 = toTitleCase(title1Raw);
    var artist1Raw = document.getElementById("artist1").value;
    var artist1 = toTitleCase(artist1Raw);
  var title2Raw = document.getElementById("name2").value;
    var title2 = toTitleCase(title2Raw);
    var artist2Raw = document.getElementById("artist2").value;
    var artist2 = toTitleCase(artist2Raw);
  var title3Raw = document.getElementById("name3").value;
    var title3 = toTitleCase(title3Raw);
    var artist3Raw = document.getElementById("artist3").value;
    var artist3 = toTitleCase(artist3Raw);
  var title4Raw = document.getElementById("name4").value;
    var title4 = toTitleCase(title4Raw);
    var artist4Raw = document.getElementById("artist4").value;
    var artist4 = toTitleCase(artist4Raw);

  // Create blank PDF document
  var doc = new PDFDocument(
    {
      autoFirstPage: false,
      // layout: 'landscape',
      margin: 25,
    }
  );

  // Change blank PDF document to a blob stream
  window.stream = doc.pipe(blobStream());

  // Get song from Ultimate Guitar with "getSong" function
  const chordsPromises = [
		getSong(title1, artist1),
		getSong(title2, artist2),
		getSong(title3, artist3),
    getSong(title4, artist4)
	];

  // Use promise to loop through "reformatChords" function
	return Promise.all(chordsPromises).then(function(chords) {
		chords.forEach(function(chordsInput, index) {
      if(index == 0){
        var titleIn = title1;
        var artistIn = artist1;
      } else if (index == 1){
        var titleIn = title2;
        var artistIn = artist2;
      } else if (index == 2){
        var titleIn = title3;
        var artistIn = artist3;
      } else {
        var titleIn = title4;
        var artistIn = artist4;
      }
			reformatChords(doc, titleIn, artistIn, chordsInput);
		});
	}).then(function() {
              doc.end();

          // Downloader
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

          // Return user feedback button change to normal
          document.getElementById("chordsProgress").innerHTML = "Musician Chords"

          // Alert user if error
        	}).catch(function(e) {
        	console.error('Something terrible has happened!', e);
        });

};

// ===================================== LYRIC SLIDESHOW (PPT) =====================================
function reformatSlides(pptx, songName, songArtist, input) {

// Reformat input with REGEX
  //remove chords
    var chordsInput1_v2 = input.replace(/(\[ch\].*\[*c*h*\])/gm, "");
                // OLD REGEX: var chordsInput1_v2 = chordsInput1.replace(/\b([CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|add)*[\d\/]*(?:[CDEFGAB](?:b|bb)*(?:#|##|sus|maj|min|aug|m|add)*[\d\/]*)*)(?=\s|$)(?!\w)/gm, "");
                // remove blank lines where chords used to be
                // var chordsInput1_v3 = chordsInput1_v2.replace(/^\s*[\r\n]*/gm, "");
  //remove song intro text
    var chordsInput1_v3 = chordsInput1_v2.replace(/".+[\s\S].+.[\s\S].+.[\s\S].+.[\s\S]/gm, "");
  //remove end of song " mark
    var chordsInput1_v3_1 = chordsInput1_v3.replace(/"/gm, "");
  //remove riff tabs (if present)
    var chordsInput1_v3_2 = chordsInput1_v3_1.replace(/.\|-.*/gm, "");
  //remove [solo] & [instrumental]
    var chordsInput1_v3_3 = chordsInput1_v3_2.replace(/\[Solo\]|\[solo\]|\[Instrumental\]|\[instrumental\]/gm, "");
  //remove extra spaces & blank lines
    var chordsInput1_v3_4 = chordsInput1_v3_3.replace(/\r?\n\s*\n/gm, "\r\n");
  //add a marker at the end of the input so the following code can find the last slide
    var chordsInput1_v4 = chordsInput1_v3_4 + "[";
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

  // Change to a loop & store indices in an array!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // // find number of slides
    // var n = (chordsInput1_v4.match(/\[/g) || []).length;
    //
    // // Create array
    // let arrayOfSlideStartIndices = []
    //
    // // create first index
    // arrayOfSlideStartIndices[0] = -1
    //
    // // loop to find all indices & store in an array
    // for (let i = 0, i < n, i++){
    //   arrayOfSlideStartIndices[i+1] = chordsInput1_v4.indexOf("[", arrayOfSlideStartIndices[i] + 1)
    // }




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
  //remove verse & chorus headers
    var slideOneNeedsTrimmed1 = slideOneIsolated1.replace(/\[.*\]/g, "");
    var slideTwoNeedsTrimmed1 = slideTwoIsolated1.replace(/\[.*\]/g, "");
    var slideThreeNeedsTrimmed1 = slideThreeIsolated1.replace(/\[.*\]/g, "");
    var slideFourNeedsTrimmed1 = slideFourIsolated1.replace(/\[.*\]/g, "");
    var slideFiveNeedsTrimmed1 = slideFiveIsolated1.replace(/\[.*\]/g, "");
    var slideSixNeedsTrimmed1 = slideSixIsolated1.replace(/\[.*\]/g, "");
    var slideSevenNeedsTrimmed1 = slideSevenIsolated1.replace(/\[.*\]/g, "");
    var slideEightNeedsTrimmed1 = slideEightIsolated1.replace(/\[.*\]/g, "");
    var slideNineNeedsTrimmed1 = slideNineIsolated1.replace(/\[.*\]/g, "");
    var slideTenNeedsTrimmed1 = slideTenIsolated1.replace(/\[.*\]/g, "");
    var slideElevenNeedsTrimmed1 = slideElevenIsolated1.replace(/\[.*\]/g, "");
    var slideTwelveNeedsTrimmed1 = slideTwelveIsolated1.replace(/\[.*\]/g, "");
  //trim white space
    var slideOne1 = slideOneNeedsTrimmed1.trim();
    var slideTwo1 = slideTwoNeedsTrimmed1.trim();
    var slideThree1 = slideThreeNeedsTrimmed1.trim();
    var slideFour1 = slideFourNeedsTrimmed1.trim();
    var slideFive1 = slideFiveNeedsTrimmed1.trim();
    var slideSix1 = slideSixNeedsTrimmed1.trim();
    var slideSeven1 = slideSevenNeedsTrimmed1.trim();
    var slideEight1 = slideEightNeedsTrimmed1.trim();
    var slideNine1 = slideNineNeedsTrimmed1.trim();
    var slideTen1 = slideTenNeedsTrimmed1.trim();
    var slideEleven1 = slideElevenNeedsTrimmed1.trim();
    var slideTwelve1 = slideTwelveNeedsTrimmed1.trim();

  //pptx Generator
    // var pptx = new PptxGenJS();
    pptx.setLayout('LAYOUT_4x3');
  //Song 1
  //Title Slide

    if (isNaN('Title')) {
      var pptxTitle1 = pptx.addNewSlide({ bkgd: '000000' });
      pptxTitle1.addText(songName, {x: 1.25, y: 3.5, font_size: 40, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'middle'});
      pptxTitle1.addText(songArtist, {x: 1.25, y: 4.5, font_size: 20, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'middle'});

  //Slide One
    if (slideTwoStart1>0) {
    var pptxOne1 = pptx.addNewSlide({ bkgd: '000000' });
    pptxOne1.addText(slideOne1, {x: 1.25, y: '3%', font_size: 30, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'top'});
    }
  //Slide Two
    if (slideThreeStart1>0) {
    var pptxTwo1 = pptx.addNewSlide({ bkgd: '000000' });
    pptxTwo1.addText(slideTwo1, {x: 1.25, y: '3%', font_size: 30, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'top'});
    }
  //Slide Three
    if (slideFourStart1>0) {
    var pptxThree1 = pptx.addNewSlide({ bkgd: '000000' });
    pptxThree1.addText(slideThree1, {x: 1.25, y: '3%', font_size: 30, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'top'});
    }
  //Slide Four
    if (slideFiveStart1>0) {
    var pptxFour1 = pptx.addNewSlide({ bkgd: '000000' });
    pptxFour1.addText(slideFour1, {x: 1.25, y: '3%', font_size: 30, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'top'});
    }
  //Slide Five
    if (slideSixStart1>0) {
    var pptxFive1 = pptx.addNewSlide({ bkgd: '000000' });
    pptxFive1.addText(slideFive1, {x: 1.25, y: '3%', font_size: 30, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'top'});
    }
  //Slide Six
    if (slideSevenStart1>0) {
    var pptxSix1 = pptx.addNewSlide({ bkgd: '000000' });
    pptxSix1.addText(slideSix1, {x: 1.25, y: '3%', font_size: 30, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'top'});
    }
  //Slide Seven
    if (slideEightStart1>0) {
    var pptxSeven1 = pptx.addNewSlide({ bkgd: '000000' });
    pptxSeven1.addText(slideSeven1, {x: 1.25, y: '3%', font_size: 30, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'top'});
    }
  //Slide Eight
    if (slideNineStart1>0) {
    var pptxEight1 = pptx.addNewSlide({ bkgd: '000000' });
    pptxEight1.addText(slideEight1, {x: 1.25, y: '3%', font_size: 30, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'top'});
    }
  //Slide Nine
    if (slideTenStart1>0) {
    var pptxNine1 = pptx.addNewSlide({ bkgd: '000000' });
    pptxNine1.addText(slideNine1, {x: 1.25, y: '3%', font_size: 30, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'top'});
    }
  //Slide Ten
    if (slideElevenStart1>0) {
    var pptxTen1 = pptx.addNewSlide({ bkgd: '000000' });
    pptxTen1.addText(slideTen1, {x: 1.25, y: '3%', font_size: 30, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'top'});
    }
  //Slide Eleven
    if (slideTwelveStart1>0) {
    var pptxEleven1 = pptx.addNewSlide({ bkgd: '000000' });
    pptxEleven1.addText(slideEleven1, {x: 1.25, y: '3%', font_size: 30, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'top'});
    }
  //Slide Twelve
    if (slideThirteenStart1>0) {
    var pptxTwelve1 = pptx.addNewSlide({ bkgd: '000000' });
    pptxTwelve1.addText(slideTwelve1, {x: 1.25, y: '3%', font_size: 30, font_face: 'Helvetica', color: 'ffffff', align: 'center', valign: 'top'});
  }};
      // pptx.save('Lyrics Slideshow');
  };
window.slides = function () {
  document.getElementById("slidesProgress").innerHTML = "Creating File..."
  // inputs
    var title1Raw = document.getElementById("name1").value;
      var title1 = toTitleCase(title1Raw);
      var artist1Raw = document.getElementById("artist1").value;
      var artist1 = toTitleCase(artist1Raw);
    var title2Raw = document.getElementById("name2").value;
      var title2 = toTitleCase(title2Raw);
      var artist2Raw = document.getElementById("artist2").value;
      var artist2 = toTitleCase(artist2Raw);
    var title3Raw = document.getElementById("name3").value;
      var title3 = toTitleCase(title3Raw);
      var artist3Raw = document.getElementById("artist3").value;
      var artist3 = toTitleCase(artist3Raw);
    var title4Raw = document.getElementById("name4").value;
      var title4 = toTitleCase(title4Raw);
      var artist4Raw = document.getElementById("artist4").value;
      var artist4 = toTitleCase(artist4Raw);
  // create PPT variable
    var pptx = new PptxGenJS();
    // now you get call your api for each title/artist and get the chords
  	// but getSong returns a promise, which means it's ASYNCHRONOUS. You'll
  	// want to get ALL of your chords before making the slideshow. You can send
  	// all of your requests in parallel by calling all three and putting the promise
  	// returned from each call into an array, like so:
    const chordsPromises = [
      getSong(title1, artist1),
  		getSong(title2, artist2),
  		getSong(title3, artist3),
      getSong(title4, artist4)
  	];

  	// then, you pass them to the Promise.all function
  	return Promise.all(chordsPromises).then(function(chords) {
  		chords.forEach(function(chordsInput, index) {
        if(index == 0){
          var titleIn = title1;
          var artistIn = artist1;
        } else if (index == 1){
          var titleIn = title2;
          var artistIn = artist2;
        } else if (index == 2){
          var titleIn = title3;
          var artistIn = artist3;
        } else {
          var titleIn = title4;
          var artistIn = artist4;
        }
  			reformatSlides(pptx, titleIn, artistIn, chordsInput);
  		});
  	}).then(function() {
  		pptx.save('Lyrics Slideshow');
      document.getElementById("slidesProgress").innerHTML = "Lyric Slideshow"
  	}).catch(function(e) {
  		console.error('Something terrible has happened!', e);
  	});

  };

// ===================================== LYRIC HANDOUT (PDF) =====================================
function reformatHandout(doc, songName, songArtist, input){
  //remove chords
    var input2 = input.replace(/(\[ch\].*\[*c*h*\])/gm, "");
  //remove song intro text
    var input3 = input2.replace(/".+[\s\S].+.[\s\S].+.[\s\S].+.[\s\S]/gm, "");
  //remove end of song " mark
    var input4 = input3.replace(/"/gm, "");
  //remove riff tabs (if present)
    var input5 = input4.replace(/.\|-.*/gm, "");
  //remove [solo] & [instrumental]
    var input6 = input5.replace(/\[Solo\]|\[solo\]|\[Instrumental\]|\[instrumental\]/gm, "");
  //remove Ð
    var input8 = input6.replace(/\r\n/gm, "\n");
  //remove Ð attempt
    // var input7 = input6.replace(/\n\n\n/gm, "\n");
    // var input8 = input7.replace(/\n\n/gm, "\n");


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
        doc.text(input8, {
          columns: 1,
        });
        doc.moveDown();
    };
window.handout = function () {
  // give user feedback
  document.getElementById("handoutProgress").innerHTML = "Creating File..."
  // inputs
  var title1Raw = document.getElementById("name1").value;
    var title1 = toTitleCase(title1Raw);
    var artist1Raw = document.getElementById("artist1").value;
    var artist1 = toTitleCase(artist1Raw);
  var title2Raw = document.getElementById("name2").value;
    var title2 = toTitleCase(title2Raw);
    var artist2Raw = document.getElementById("artist2").value;
    var artist2 = toTitleCase(artist2Raw);
  var title3Raw = document.getElementById("name3").value;
    var title3 = toTitleCase(title3Raw);
    var artist3Raw = document.getElementById("artist3").value;
    var artist3 = toTitleCase(artist3Raw);
  var title4Raw = document.getElementById("name4").value;
    var title4 = toTitleCase(title4Raw);
    var artist4Raw = document.getElementById("artist4").value;
    var artist4 = toTitleCase(artist4Raw);
  // create PDF variable
    var doc = new PDFDocument(
      {
        // autoFirstPage: false,
        // layout: 'landscape',
        margin: 25,
      }
    );
    window.stream = doc.pipe(blobStream());

    const chordsPromises = [
      getSong(title1, artist1),
      getSong(title2, artist2),
      getSong(title3, artist3),
      getSong(title4, artist4)
    ];

    return Promise.all(chordsPromises).then(function(chords) {
      chords.forEach(function(chordsInput, index) {
        if(index == 0){
          var titleIn = title1;
          var artistIn = artist1;
        } else if (index == 1){
          var titleIn = title2;
          var artistIn = artist2;
        } else if (index == 2){
          var titleIn = title3;
          var artistIn = artist3;
        } else {
          var titleIn = title4;
          var artistIn = artist4;
        }
        reformatHandout(doc, titleIn, artistIn, chordsInput);
      });
    }).then(function() {
        doc.end();
        var filename = 'Lyric Handout';
        // <!---downloader-->
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
        // return user feedback button change to normal
        document.getElementById("handoutProgress").innerHTML = "Lyric Handout"
      }).catch(function(e) {
      console.error('Something terrible has happened!', e);
    });
  };

// ===================================== LYRICS ON PAPER (DOC) TEST???? =====================================
window.test = function () {

  var filename = 'Lyrics on Paper';
  // inputs
    var title1 = document.getElementById("name1").value;
    var chordsInput1 = document.getElementById("chords1").value;
    var title2 = document.getElementById("name2").value;
    var chordsInput2 = document.getElementById("chords2").value;
    var title3 = document.getElementById("name3").value;
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











// ===================================== CODE VAULT =====================================
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
  //     var title1 = document.getElementById("name1").value;
  //     var chordsInput1 = document.getElementById("chords1").value;
  //
  //     var title2 = document.getElementById("name2").value;
  //     var chordsInput2 = document.getElementById("chords2").value;
  //
  //     var title3 = document.getElementById("name3").value;
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
