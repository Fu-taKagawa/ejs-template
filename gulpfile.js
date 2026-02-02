const gulp = require('gulp');
const rename = require('gulp-rename');
const ejs = require('gulp-ejs');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const prettier = require('gulp-prettier');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const path = require('path');
const fs = require('fs');
const { src, dest, series, watch } = require('gulp');
const data = require('gulp-data');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const browserSync = require('browser-sync').create();

const customFileLoader = (filePath) => {
  const rootPath = path.resolve('./src/ejs');
  const normalizedPath = filePath.replace(/^\//, '');
  const fullPath = path.resolve(rootPath, normalizedPath);

  console.log('Loading file:', fullPath);

  if (fs.existsSync(fullPath)) {
    return fs.readFileSync(fullPath, 'utf8');
  } else {
    throw new Error('File not found: ' + fullPath);
  }
};

// EJSファイルをコンパイルする関数
const ejsFunc = () => {
  return src(['./src/ejs/**/*.ejs', '!./src/ejs/**/_*.ejs'])
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(data((file) => {
      const relativePath = path.relative(path.resolve('./src/ejs'), file.path);
      const depth = relativePath.split(path.sep).length - 1;
      const prefix = depth === 0 ? './' : '../'.repeat(depth);
      return { 
        pathPrefix: prefix
      };
    }))
    .pipe(ejs({}, {}, { ext: '.html' }))
    .pipe(rename({ extname: '.html' }))
    .pipe(prettier({
      printWidth: 150,
      semi: true,
      singleQuote: true,
      trailingComma: 'all',
    }))
    .pipe(dest('./dist/'));
};

// SCSSファイルを1つのCSSファイルにコンパイルする関数
const scssFunc = () => {
  return src('./src/scss/style.scss')
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(dest('./dist/'));
};

const imageFunc = () => {
  return src('./src/images/**/*', { buffer: true })
    .pipe(dest('./dist/images'));
};

// JSファイルをビルドする関数
const jsFunc = () => {
  return webpackStream(webpackConfig, webpack)
    .pipe(dest('./dist/'));
};

// サーバー起動の設定
const syncInit = (done) => {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
    port: 8000,
    open: true,
  });
  done();
};

// ブラウザをリロードする関数
const browserReload = (done) => {
  browserSync.reload();
  done();
};

// watch
const watchFiles = () => {
  watch('./src/ejs/**/*.ejs', series(ejsFunc, browserReload));
  watch('./src/scss/**/*.scss', series(scssFunc, browserReload));
  watch('./src/images/**/*', series(imageFunc, browserReload));
  watch('./src/js/**/*.js', series(jsFunc, browserReload));
};

exports.default = series(
  ejsFunc, 
  scssFunc, 
  imageFunc, 
  jsFunc, 
  syncInit,
  watchFiles
);

// gulpタスクの定義
exports.ejsFunc = ejsFunc;
exports.scssFunc = scssFunc;
exports.watchFiles = watchFiles;
exports.imageFunc = imageFunc;
exports.jsFunc = jsFunc;

// 監視(watch)を含まず、生成のみを行うタスクとして定義します
exports.build = series(ejsFunc, scssFunc, imageFunc, jsFunc);
exports.default = series(ejsFunc, scssFunc, imageFunc, jsFunc, watchFiles);
