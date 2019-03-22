"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create()
var nodemon = require('gulp-nodemon');
const cssnano = require("cssnano");
const del = require("del");
// const eslint = require("gulp-eslint");
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");

// Clean assets
function clean() {
  return del(["./public/css"]);
}

// CSS task
function css() {
  return gulp
    .src("./sass/*.scss")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(gulp.dest("./public/css/"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest("./public/css/"))
    .pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
  gulp.watch("./sass/*", css);
  // gulp.watch("./assets/js/**/*", gulp.series(scriptsLint, scripts));
  gulp.series(browserSyncReload)
}

// BrowserSync
function browserSync(done) {
  browsersync.init(null, {
		proxy: "http://localhost:3000",
        files: ["public/**/*.*"],
        port: 3001,
	});
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  console.log('reloading ...');
  browsersync.reload();
  done();
}

// Spawn the node server
function spawnServer(cb) {
  var started = false;
	return nodemon({
		script: 'app.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true;
		}
	});
}

// define complex tasks
const build = gulp.series(clean, browserSync, gulp.parallel(css, watchFiles, spawnServer));
const watch = gulp.parallel(watchFiles, spawnServer);
const spawn = gulp.parallel(spawnServer);

// export tasks
exports.css = css;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.spawn = spawn;
exports.default = build;
