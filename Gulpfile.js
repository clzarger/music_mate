const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const babel = require('babelify');
const clean = require('gulp-clean');
const sequence = require('gulp-sequence');
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('gulp4-run-sequence');
const fs = require('fs');

function defaultTask(cb) {
	console.log("Default task ran, great work!")
  cb();
}
exports.default = defaultTask

gulp.task('clean', () =>
	gulp.src('./dist/*', { read: false }).pipe(clean())
);

gulp.task('bundle', () =>
	browserify('./src/js/root.js')
		.transform(babel, { presets: ['es2015'] })
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist'))
);

function copyStatic(cb) {
	gulp.src([
		'./src/index.html',
		'./src/faq.html',
		'./src/works.html',
		'./src/give.html',
		'./src/css/styles.css',
			// Images
		'./src/copy.png',
		'./src/paste.png',
		'./src/play.png',
		'./src/mm_logo_long.png',
		'./src/mm_logo_stacked.png',
		'./src/mm_favicon.png',
		'./src/favicon.png',
		
		'./node_modules/pptxgenjs/dist/pptxgen.bundle.js',
		'./node_modules/express/lib/express.js'
	]).pipe(gulp.dest('./dist'));

  cb();
}
exports.copyStatic = copyStatic


gulp.task('build', function (callback) {
  runSequence(
		'clean',
    'bundle',
    'copyStatic',
    callback
//  ^^^^^^^^
//  This informs that the sequence is complete.
  );
});


// ========== DEPRECATED. Tylor's version from 2017 ==========
// gulp.task('copyStatic', () => {
// 	gulp.src([
// 		'./src/index.html',
//     './src/about.html',
// 		'./src/works.html',
// 		'./src/give.html',
//     './src/css/styles.css',
// 			// Images
// 		'./src/favicon.png',
// 		'./src/logoWithName.png',
// 		'./src/copy.png',
// 		'./src/paste.png',
// 		'./src/play.png',
// 		'./src/1.png',
// 		'./src/2.png',
// 		'./src/3.png',
// 		'./src/4.png',
//
//     './node_modules/pptxgenjs/dist/pptxgen.bundle.js',
// 		'./node_modules/express/lib/express.js'
// 	]).pipe(gulp.dest('./dist'));
// });
//
// gulp.task('build', sequence('clean', 'bundle', 'copyStatic'));






// // ========== REWORKING IDEA from the internet ==========
// gulp.task('copyStatic', gulp.series('task1-1', function (done) {
//    // task 1 code here
//     done();
// }));
//
// gulp.task('task2', gulp.series('task2-1', function (done) {
//    // task 2 code here
//     done();
// }));
//
//
// gulp.task('main', gulp.series('clean', 'bundle', 'copyStatic', function (done) {
//     done();
// }));
