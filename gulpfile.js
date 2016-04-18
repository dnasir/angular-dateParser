var del = require("del");
var gulp = require("gulp");
var gutil = require("gulp-util");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var header = require("gulp-header");
var rename = require("gulp-rename");
var strip = require("gulp-strip-comments");
var Server = require("karma").Server;
var tsc = require("gulp-typescript");
var ghPages = require("gulp-gh-pages");

var outputPath = "dist/";
var pkg = require("./package.json");
var banner = ["/*!", " * <%= pkg.name %> <%= pkg.version %>", " * <%= pkg.homepage %>", " * Copyright (c) <%= new Date().getFullYear() %>, <%= pkg.author %>", " * Licensed under: <%= pkg.license %>", " */\n\n"].join("\n");

gulp.task("clean", function() {
    del([outputPath + "**/*"]);
});

gulp.task("test", function(done) {
    var server =  new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    });

    server.on("browser_error", function (browser, err){
        gutil.log("Karma Run Failed: " + err.message);
        throw err;
    });

    server.on("run_complete", function (browsers, results){
        if (results.failed) {
            throw new Error("Karma: Tests Failed");
        }
        gutil.log("Karma Run Complete: No Failures");
        done();
    });

    server.start();
});

gulp.task("build:standard", function() {
    return gulp.src("src/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsc({
            target: "ES5",
            outFile: "angular-dateparser.js",
            removeComments: true
        }))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(outputPath));
});

gulp.task("build:minified", function() {
    return gulp.src("src/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsc({
            target: "ES5",
            outFile: "angular-dateparser.min.js",
            removeComments: true
        }))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(outputPath))
});

gulp.task("build", ["clean", "build:standard", "build:minified"]);

gulp.task("gh-pages", ['build'], function() {
    return gulp.src([
        "dist/angular-dateparser.js",
        "dist/angular-dateparser.js.map",
        "index.html"
    ], {
        base: "."
    })
    .pipe(ghPages());
});

gulp.task("watch", ["build"], function() {
    return gulp.watch("src/**/*.ts", ["build", "test"]);
});

gulp.task("default", ["build", "test"]);
