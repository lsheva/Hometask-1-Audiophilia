var gulp = require("gulp"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify"),
  webpack = require("webpack"),
  webpackStream = require("webpack-stream"),
  browserSync = require("browser-sync"),
  ftp = require("vinyl-ftp"),
  sass = require("gulp-sass"),
  notify = require("gulp-notify"),
  cleancss = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  autoprefixer = require("gulp-autoprefixer"),
  gutil = require("gulp-util");

var syntax = "sass"; // Syntax: sass or scss;

gulp.task("scripts", function() {
  return gulp
    .src("./src/js/index.js")
    .pipe(
      webpackStream({
        output: {
          filename: "bundle.js"
        },
        module: {
          rules: [
            {
              test: /\.(js)$/,
              exclude: /(node_modules)/,
              loader: "babel-loader",
              query: {
                presets: ["env"]
              }
            }
          ]
        },
        resolve: {
          extensions: [".js", ".css", ".scss"]
        },
        devtool: "eval",
        plugins: [
          new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
          })
        ],
        externals: {
          jquery: "jQuery"
        }
      })
    )
    .pipe(gulp.dest("./dist/"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.reload({ stream: true }));
});

// Local Server
gulp.task("browser-sync", function() {
  browserSync({
    server: {
      baseDir: "dist"
    },
    notify: false
    // open: false,
    // online: false, // Work Offline Without Internet Connection
    // tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
  });
});

// Sass|Scss Styles
gulp.task("styles", function() {
  return gulp
    .src("src/" + syntax + "/**/*." + syntax + "")
    .pipe(
      sass({ includePaths: ["./node_modules"] }).on("error", notify.onError())
    )
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(autoprefixer(["last 15 versions"]))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
});

// Fonts
gulp.task("fonts", function() {
  return gulp
    .src("src/sass/fontawesome-free/**/*.*")
    .pipe(gulp.dest("dist/css/fontawesome-free/"));
});

gulp.task("code", function() {
  return gulp
    .src("src/**/*.+(html|php)")
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("images", function() {
  return gulp
    .src("src/images/*.*")
    .pipe(gulp.dest("dist/images/"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("watch", function() {
  gulp.watch("src/" + syntax + "/**/*." + syntax + "", gulp.parallel("styles"));
  gulp.watch("src/js/*.js", gulp.parallel("scripts"));
  gulp.watch("src/**/*.+(html|php)", gulp.parallel("code"));
  gulp.watch("src/images/*.*", gulp.parallel("images"));
});

gulp.task(
  "default",
  gulp.parallel(
    "styles",
    "scripts",
    "code",
    "images",
    "browser-sync",
    "watch",
    "fonts"
  )
);
