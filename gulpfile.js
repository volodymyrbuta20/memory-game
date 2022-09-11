const { src, dest, watch, parallel }  = require('gulp');
const browserSync   = require('browser-sync').create();

function browsersync() {
    browserSync.init({
        server : {
        baseDir: 'src/'
        }
    });
}

function scripts() {
    return src([
      'src/js/main.js'
    ])
      .pipe(browserSync.stream());
  }

  function watching() {
    watch(['src/css/*.css']).on('change', browserSync.reload);
    watch(['src/js/**/*.js', '!app/js/main.min.js'], scripts);
    watch(['src/*.html']).on('change', browserSync.reload);
  }


exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;


exports.default = parallel(scripts ,browsersync, watching);
