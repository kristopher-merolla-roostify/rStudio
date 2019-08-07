var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var config = require('./config/env');

var runSequence = require('run-sequence');
var del = require('del');
// var rev = require('gulp-rev')
// var revCollector = require('gulp-rev-collector');
// var minifyHTML   = require('gulp-minify-html');
// var revFormat = require('gulp-rev-format');
// var replace = require('gulp-replace');
// var revReplace = require('gulp-rev-replace');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var onError = function (err) {
  $.util.beep();
  console.log(err);
};

gulp.task("clean", function () {
  return gulp.src(config.clean.dest)
    .pipe($.clean());
})


//Fonts & Images 根据MD5获取版本号
// gulp.task('revFont', function(){
//   return gulp.src(fontSrc)
//     .pipe(rev())
//     .pipe(gulp.dest(fontDest))
//     .pipe(rev.manifest())
//     .pipe(gulp.dest('src/rev/font'));
// });

gulp.task('devimg', function () {
  return gulp.src(config.img.all)
    .pipe($.imagemin())
    .pipe(gulp.dest(config.img.dest))
});

gulp.task('img', function () {
  return gulp.src(config.img.all)
    .pipe($.imagemin())
    .pipe($.rev())
    .pipe(gulp.dest(config.img.dest))
    .pipe($.rev.manifest())
    .pipe(gulp.dest(config.img.rev))
});

gulp.task('js', function () {
  return gulp.src(config.js.tmp)
    .pipe($.plumber({
      errorHandler: onError
    })) //使用plumber
    .pipe($.uglify())
    .pipe($.rev())
    .pipe(gulp.dest(config.js.dest))
    .pipe($.rev.manifest())
    .pipe(gulp.dest(config.js.rev));
});

gulp.task('devjs', function () {
  return gulp.src(config.js.all)
    .pipe($.plumber({
      errorHandler: onError
    })) //使用plumber
    .pipe($.uglify())
    .pipe(gulp.dest(config.js.dest))
    .pipe(reload({stream: true}));
});

gulp.task('css', function () {
  return gulp.src(config.css.tmp)
    .pipe($.plumber({
      errorHandler: onError
    }))
    .pipe($.sass({outputStyle: 'compressed'}))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
      remove: false
    }))
    .pipe($.rev())
    .pipe(gulp.dest(config.css.dest))
    .pipe($.rev.manifest())
    .pipe(gulp.dest(config.css.rev));
});

gulp.task('devcss', function () {
  return gulp.src(config.css.all)
    .pipe($.plumber({
      errorHandler: onError
    }))
    .pipe($.sass({outputStyle: 'compressed'}))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
      remove: false
    }))
    .pipe(gulp.dest(config.css.dest))
    .pipe(reload({stream: true}));
});

//CSS里更新引入文件版本号
gulp.task('revCss', function () {
  return gulp.src(['build/rev/**/*.json', 'css/*.scss'])
    .pipe($.revCollector())
    .pipe(gulp.dest('build/tmp'));
});

//CSS里更新引入文件版本号
gulp.task('revJs', function () {
  return gulp.src(['build/rev/**/*.json', 'js/*.js'])
    .pipe($.revCollector())
    .pipe(gulp.dest('build/tmp'));
});

//Html替换css、js文件版本
gulp.task('html', function () {
  return gulp.src(['build/rev/**/*.json', '*.html'])
    .pipe($.revCollector({
      replaceReved: true,
    }))
    .pipe( $.minifyHtml({
      empty:true,
      spare:true
    }))
    .pipe(gulp.dest(config.html.dest));
});


// 生成版本号清单
gulp.task('revJson', function () {
  return gulp.src(['build/**/*.*'])
    .pipe($.rev())
    .pipe($.revFormat({
      prefix: '.',
      suffix: '.cache',
      lastExt: false
    }))
    .pipe($.rev.manifest())
    .pipe(gulp.dest("build/tmp"));
});


gulp.task('addVersion',['revJson'], function() {
  var manifest = gulp.src(["build/tmp/rev-manifest.json"]);

  function modifyUnreved(filename) {
    return filename;
  }

  function modifyReved(filename) {
    if (filename.indexOf('.cache') > -1) {
      const _version = filename.match(/\.[\w]*\.cache/)[0].replace(/(\.|cache)*/g, "");
      const _filename = filename.replace(/\.[\w]*\.cache/, "");
      filename = _filename + "?v=" + _version;
      return filename;
    }
    return filename;
  }

  return gulp.src(['*.html'])
    .pipe($.replace(/(\.[a-z]+)\?(v=)?[^\'\"\&]*/g, "$1"))
    .pipe($.revReplace({
      manifest: manifest,
      modifyUnreved: modifyUnreved,
      modifyReved: modifyReved
    }))
    .pipe(gulp.dest(config.html.dest));
})


gulp.task('delrev', function () {
  del(['build/rev','build/tmp']);
})

gulp.task('watch', function (done) {
  gulp.watch(config.css.all, ['devcss']);
  gulp.watch(config.js.all, ['devjs']);
  gulp.watch(config.img.all, ['devimg']);
  gulp.watch("*.html", reload);
  done();
})

gulp.task('server', function (done) {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  done();
});

gulp.task('dist', function (done) {
  runSequence(
    'img',
    'revCss',
    'revJs',
    ['css', 'js'],
    'html',
    'delrev'
  );
  done();
});

gulp.task('vdist', function (done) {
  runSequence(
    'devimg',
    ['devcss', 'devjs'],
    'addVersion'
  );
  done();
});


gulp.task('default', function (done) {
  runSequence(
    'devimg',
    ['devcss', 'devjs'],
    'watch',
  function () {
    gulp.start(['server'])
    done();
  });
});