	// Include gulp
	var gulp = require('gulp');

	// Include Plugins
	var less = require('gulp-less'),
	    autoprefixer = require('gulp-autoprefixer'),
	    minifycss = require('gulp-minify-css'),
	    jshint = require('gulp-jshint'),
	    uglify = require('gulp-uglify'),
	    imagemin = require('gulp-imagemin'),
	    rename = require('gulp-rename'),
	    clean = require('gulp-clean'),
	    concat = require('gulp-concat'),
	    notify = require('gulp-notify'),
	    cache = require('gulp-cache'),
	    livereload = require('gulp-livereload'),
	    deploy = require("gulp-gh-pages");

	var gitRemoteUrl = "";

	var bases = {
	 web: 'web/',
	 dist: 'dist/',
	};

	var paths = {
	 scripts: ['scripts/web.js'],
	 styles: ['styles/*.css'],
	 html: ['index.html'],
	 images: ['images/**/*.png'],
	 extras: ['crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico'],
	};

	// Delete the dist directory
	gulp.task('clean', function() {
	 return gulp.src(bases.dist)
	 .pipe(clean());
	});

	// Compile our less
	gulp.task('less', function() {
	    gulp.src('web/less/*.less')
	        .pipe(less())
	        .pipe(gulp.dest('web/styles'));
	});

	// Process scripts and concatenate them into one output file
	gulp.task('scripts', ['clean'], function() {
	 gulp.src(paths.scripts, {cwd: bases.web})
	 .pipe(jshint())
	 .pipe(jshint.reporter('default'))
	 .pipe(uglify())
	 .pipe(concat('web.min.js'))
	 .pipe(gulp.dest(bases.dist + 'scripts/'));
	});

	// Imagemin images and ouput them in dist
	gulp.task('imagemin', ['clean'], function() {
	 gulp.src(paths.images)
	 .pipe(imagemin())
	 .pipe(gulp.dest(bases.dist));
	});

	// Copy all other files to dist directly
	gulp.task('copy', ['clean'], function() {
	 // Copy html
	 gulp.src(paths.html, {cwd: bases.web})
	 .pipe(gulp.dest(bases.dist));

	// Copy styles
	 gulp.src(paths.styles, {cwd: bases.web})
	 .pipe(gulp.dest(bases.dist + 'styles'));
	 
	 // Copy lib scripts, maintaining the original directory structure
	 //gulp.src(paths.libs, { cwd: bases.web })
	 //.pipe(gulp.dest(bases.dist + 'libs'));
	 
	 // Copy extra html5bp files
	 gulp.src(paths.extras, {cwd: bases.web})
	 .pipe(gulp.dest(bases.dist));
	});

	// Watch Files For Changes
	gulp.task('watch', function() {
	    gulp.watch('web/scripts/*.js', ['lint', 'scripts']);
	    gulp.watch('web/less/*.less', ['less']);
	});

	gulp.task('deploy', function () {
	    gulp.src("./dist/**/*")
	        .pipe(deploy(gitRemoteUrl));
	});



	// Default Task
	gulp.task('default', ['clean', 'less', 'scripts', 'imagemin', 'watch']);

	// Build Task
	gulp.task('build', ['clean', 'less', 'scripts', 'imagemin', 'copy']);

	// Deploy Task
	gulp.task('deploy', ['clean', 'less', 'scripts', 'imagemin', 'copy', 'deploy']);
