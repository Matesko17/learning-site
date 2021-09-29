
const php = false;


const { task, src, dest, watch, series, parallel } = require('gulp');

// CSS related plugins
const sass          	 = require( 'gulp-sass' );
const autoprefixer  	 = require( 'autoprefixer' );
const postcss 	  	 	 = require( 'gulp-postcss' );
const purgecss 	  	 	 = require( 'gulp-purgecss' );
const stripCssComments 	 = require( 'gulp-strip-css-comments' );
sass.compiler 	  	 	 = require( 'node-sass' );

// HTML related plugins
const htmlmin 			 = require( 'gulp-htmlmin' );

// JS related plugins
const babel        		 = require( 'gulp-babel' );
const uglify        	 = require( 'gulp-uglify' );

// Utility plugins
const rename        	 = require( 'gulp-rename' );
const sourcemaps    	 = require( 'gulp-sourcemaps' );
const notify        	 = require( 'gulp-notify' );
const options       	 = require( 'gulp-options' );
const gulpif        	 = require( 'gulp-if' );
const concat        	 = require( 'gulp-concat' );
const del 				 = require( 'del' );

// Browsers related plugins
const browserSync   = require( 'browser-sync' ).create();

const paths = {
	watch: {
        js:         "src/js/**/*.js",
        sass:       "src/scss/**/*.scss",
		images:     "src/images/**/*",
		fonts:		"src/fonts/**/*",
		html:		"src/**/*.html"
    },
    fonts: {
        src: [
			// slick
			// "node_modules/slick-carousel/slick/fonts/**",

			// lightgallery
			// "node_modules/lightgallery/dist/fonts/**",

			// our fonts
			"src/fonts/**"
        ],
        dest:   "dist/fonts",
        clean:  "dist/fonts/**/*"
	},
	prescripts: {
		src: [
			// LAZYLOADING
			"node_modules/lazysizes/lazysizes.min.js",
		],
		dest: 'dist/js'
	},
    scripts: {
        src: [
            // jQUERY
            "node_modules/jquery/dist/jquery.js",

            // CUSTOM ALERTS
            // "node_modules/sweetalert2/dist/sweetalert2.js",

            // SLICK CAROUSEL
			// "node_modules/slick-carousel/slick/slick.js",

			// AOS - animate elements on scroll
			// "node_modules/aos/dist/aos.js",

            // LIGHT GALLERY
			// "node_modules/lightgallery/dist/js/lightgallery.js",

            // LIGHT GALLERY MODULES
            //"node_modules/lg-autoplay/dist/lg-autoplay.js",
            //"node_modules/lg-fullscreen/dist/lg-fullscreen.js",
            //"node_modules/lg-hash/dist/lg-hash.js",
            //"node_modules/lg-pager/dist/lg-pager.js",
            //"node_modules/lg-share/dist/lg-share.js",
            //"node_modules/lg-thumbnail/dist/lg-thumbnail.js",
            //"node_modules/lg-video/dist/lg-video.js",
            //"node_modules/lg-zoom/dist/lg-zoom.js",

            // CUSTOM SCROLLBAR PLUGIN
			"node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js",

            // OUR CUSTOM SCRIPTS
            "src/js/**/*.js"
        ],
        dest:   "dist/js",
        name:   "scripts.js",
    },
    sass: {
		src:        "src/scss/style.scss",
        dest:       "dist/css"
    },
    images: {
		src:    "src/images",
		vendors: [
			// slick
			// 'node_modules/slick-carousel/slick/ajax-loader.gif',

			// lightgallery
			// 'node_modules/lightgallery/dist/img/loading.gif'
		],
        dest:   "dist/images",
        clean:  "dist/images/**/*"
	},
	html: {
		src: 'src/*.html',
		dest: 'dist/'
	},
	php: {
		src: 'src/*.php',
		dest: 'dist/'
	}
}



// Tasks
function browser_sync() {
	if (!php) {
		browserSync.init({
			server: {
				baseDir: './dist/'
			}
		});
	}
}

function reload(done) {
	if (!php) {
		browserSync.reload();
	}

	done();
}

function css(done) {

	let typeFile = php ? paths.php.dest + '*.php' : paths.html.dest + '*.html';

	src( [ paths.sass.src ] )
	.pipe( sourcemaps.init() )
	.pipe( gulpif( options.has('prod'), sass({
			errLogToConsole: true,
			outputStyle: 'compressed',
		}), sass() )
		.on( 'error', function() {
			src(paths.scripts.dest + '/scripts.min.js').pipe( notify({ message: 'Chyba v styloch' }) );
		} )
		.on( 'error', console.error.bind( console )))

	.pipe( gulpif( options.has('prod'), purgecss({ content: [typeFile], whitelistPatterns: [/app/gm], whitelistPatternsChildren: [/app/gm] }) ))

	.pipe( gulpif( options.has('prod'), postcss( [autoprefixer({ grid: true })] )) )
	.pipe( rename( { suffix: '.min' } ))
	.pipe( gulpif( !options.has('prod'), sourcemaps.write( './' )) )
	.pipe( gulpif( options.has('prod'), stripCssComments({preserve: false}) ))
	.pipe( dest( paths.sass.dest ) )
	.pipe( browserSync.stream() );


	done();
}

function js(done) {
	src( paths.scripts.src )
	.pipe( sourcemaps.init({ loadMaps: true }) )
	.pipe( concat('scripts') )
	.pipe( rename( { extname: '.min.js' } ) )
	.pipe( babel({
		presets: ['@babel/env']
	}) )
	.pipe( gulpif( options.has('prod'), uglify()) )
	.pipe( gulpif( !options.has('prod'), sourcemaps.write( '.' )) )
	.pipe( dest(paths.scripts.dest) )
	.pipe( browserSync.stream() );

	done();
}

function prescripts(done) {
	if (paths.prescripts.src.length > 0) {
		src( paths.prescripts.src )
		.pipe( concat('prescripts') )
		.pipe( rename( { extname: '.min.js' } ) )
		.pipe( gulpif( options.has('prod'), uglify()) )
		.pipe( dest(paths.prescripts.dest) )
		.pipe( browserSync.stream() );
	}

	done();
}

function clean(done) {
	if (options.has('prod') || options.has('rebuild')) {
		return del(['dist/**', '!dist']);
	}
	else done();
}

function vendorsImages(done) {
	if (paths.images.vendors.length > 0) {
		src(paths.images.vendors).pipe(dest(paths.images.dest));
		return done();
	} else return done();
}

function images(done) {
	src(paths.images.src + '/**').pipe(dest(paths.images.dest));
	done();
}

function fonts(done) {
	src(paths.fonts.src).pipe( dest(paths.fonts.dest) );
	done();
}

function html(done) {
	let fileType = php ? paths.php.src : paths.html.src;

	src(fileType)
	.pipe( gulpif( options.has('prod'), htmlmin({ collapseWhitespace: true, removeComments: true }) ))
	.pipe( dest(paths.html.dest) );

	done();
}

function watch_files() {
	watch(paths.watch.sass, series(css, reload));
	watch(paths.watch.js, series(js, reload));
	watch(paths.watch.images, series(images, reload));
	watch(paths.watch.fonts, series(fonts, reload));
	watch(paths.watch.html, series(html, reload));

	src(paths.scripts.dest + '/scripts.min.js')
		.pipe( notify({ message: 'Watcher je spusteny' }) );
}


task('vendors-image', vendorsImages);

exports.default = series(clean, fonts, 'vendors-image', images, html, prescripts, js, css);
exports.watch = parallel(browser_sync, watch_files);