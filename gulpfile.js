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

gulp.task("build", ["clean", "test"], function(done) {
    return gulp.src(["dateparser.js", "dateparser.directive.js"])
        .pipe(concat("angular-dateparser.js"))
        .pipe(strip())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest(outputPath))
        .pipe(rename("angular-dateparser.min.js"))
        .pipe(sourcemaps.init())
        .pipe(uglify({
            mangle: true,
            preserveComments: "license"
        }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(outputPath))
        .on("end", done);
});

gulp.task("default", ["build"]);
