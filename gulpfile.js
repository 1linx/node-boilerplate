"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const cp = require("child_process");
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
  console.log('cleaning');
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
    // .pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
  gulp.watch("./scss/**/*", css);
  // gulp.watch("./assets/js/**/*", gulp.series(scriptsLint, scripts));
}


function spawnServer() {
  return cp
    .spawn('node', ['app.js'], { stdio: 'inherit' });
}
// gulp.task('serve', function() {
//   spawn('node', ['app.js'], { stdio: 'inherit' });
// });

// define complex tasks
const build = gulp.series(clean, gulp.parallel(css));
const watch = gulp.parallel(watchFiles, spawnServer);
const spawn = gulp.parallel(spawnServer);

// export tasks
exports.css = css;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.spawn = spawn;
exports.default = spawn;
