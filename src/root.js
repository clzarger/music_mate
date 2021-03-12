/* eslint-disable */


// ===== pptx that works =====
// import pptxgen from 'pptxgenjs';

// // 1. Create a new Presentation
// let pres = new pptxgen();

// // 2. Add a Slide
// let slide = pres.addSlide();

// // 3. Add one or more objects (Tables, Shapes, Images, Text and Media) to the Slide
// let textboxText = "Hello World from PptxGenJS!";
// let textboxOpts = { x: 1, y: 1, color: "363636" };
// slide.addText(textboxText, textboxOpts);

// // 4. Save the Presentation
// pres.writeFile();

// =================================
// ===== LYRICS ON PAPER (DOC) TEST???? =====
// =================================
// window.handoutDoc = function () {
//   var doc = new docx();
//   doc.addSection({
//     properties: {},
//     children: [
//         new Paragraph({
//             children: [
//                 new TextRun("Hello World"),
//                 new TextRun({
//                     text: "Foo Bar",
//                     bold: true,
//                 }),
//                 new TextRun({
//                     text: "\tGithub is the best",
//                     bold: true,
//                 }),
//             ],
//         }),
//     ],
//   });
// };
// console.log('hey there! it works');
// alert('hey there');
// };
//   // Create document
//   const doc = new Document();

//   // Documents contain sections, you can have multiple sections per document, go here to learn more about sections
//   // This simple example will only contain one section
//   doc.addSection({
//       properties: {},
//       children: [
//           new Paragraph({
//               children: [
//                   new TextRun("Hello World"),
//                   new TextRun({
//                       text: "Foo Bar",
//                       bold: true,
//                   }),
//                   new TextRun({
//                       text: "\tGithub is the best",
//                       bold: true,
//                   }),
//               ],
//           }),
//       ],
//   });

//   // Used to export the file into a .docx file
//   Packer.toBuffer(doc).then((buffer) => {
//       fs.writeFileSync("My Document.docx", buffer);
//   });
//   // Done! A file called 'My Document.docx' will be in your file system.
// };

// Old code that was here:
// var docx = require('docx');
// var doc = new docx.Document();
// var paragraph = new docx.Paragraph("Some cool text here.");
// var exporter = new docx.LocalPacker(doc);
// exporter.pack('My Document');
