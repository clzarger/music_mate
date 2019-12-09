const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const babel = require('babelify');
const clean = require('gulp-clean');
const sequence = require('gulp-sequence');
const sourcemaps = require('gulp-sourcemaps');

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

gulp.task('copyStatic', () => {
	gulp.src([
		'./src/index.html',
    './src/about.html',
		'./src/works.html',
		'./src/give.html',
    './src/css/styles.css',
			// Images
		'./src/favicon.png',
		'./src/logoWithName.png',
		'./src/copy.png',
		'./src/paste.png',
		'./src/play.png',
		'./src/1.png',
		'./src/2.png',
		'./src/3.png',
		'./src/4.png',

    './node_modules/pptxgenjs/dist/pptxgen.bundle.js',
		'./node_modules/express/lib/express.js'
	]).pipe(gulp.dest('./dist'));
});

gulp.task('build', sequence('clean', 'bundle', 'copyStatic'));
