var gulp       = require('gulp'),
    twig         = require('gulp-twig'),
    webserver    = require('gulp-webserver'),
    sass         = require('gulp-sass')(require('sass')),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin');

gulp.task('webserver', () => {
    return gulp.src('public')
        .pipe(webserver({
            port: 8000,
            livereload: true,
            directoryListing: false,
            open: true,
            fallback: './public/index.html'
        }));
});

gulp.task('twig', function() {
    return gulp.src([
        'src/templates/*.twig',
    ])
        .pipe(
        twig().on('error', function (err) {
            process.stderr.write(err.message + '\n');
            this.emit('end');
        })
    )
        .pipe(gulp.dest('public/'));

});

gulp.task('images', async function() {
    gulp.src([
        'src/assets/images/*',
        'src/assets/images/*/*',
        ])
        .pipe(imagemin([
            imagemin.optipng({quality: 100}),

        ]))
        .pipe(gulp.dest('public/assets/images/'));
});

gulp.task('styles', function() {
    return gulp.src([
        'src/assets/styles/settings.scss',
        'src/assets/styles/components/*.scss',
        'src/assets/styles/*.scss',
    ])
        .pipe(concat('index.css'))
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        // .pipe(concat('index.css'))
        .pipe(gulp.dest('public/assets/css'))
});

gulp.task('styles-min', function() {
    return gulp.src([
        'src/assets/styles/settings.scss',
        'src/assets/styles/components/*.scss',
        'src/assets/styles/*.scss',
    ])
        .pipe(concat('index.css'))
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(cssnano())
        .pipe(gulp.dest('public/assets/css'))
});

gulp.task('scripts', function() {
    return gulp.src([
        'src/assets/js/*.js',
    ])
        .pipe(concat('index.js'))
        .pipe(gulp.dest('public/assets/js'));
});

gulp.task('scripts-min', function() {
    return gulp.src([
        'src/assets/js/*.js',
    ])
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/assets/js'));
});


gulp.task('watcher', function() {

    gulp.watch([
        'src/assets/styles/*/*.scss',
        'src/assets/styles/*.scss',
        ], gulp.parallel('styles'));

    gulp.watch('src/assets/js/*.js', gulp.parallel('scripts'));

    gulp.watch([
        'src/templates/*/*.twig',
        'src/templates/*.twig'
        ],gulp.parallel('twig'));

    gulp.watch([
        'src/assets/images/*',
        'src/assets/images/*/*',
        ], gulp.parallel('images'));
});

gulp.task('watch', gulp.parallel('webserver', 'watcher'));
gulp.task('dev', gulp.parallel('styles', 'scripts', 'twig', 'images'));
gulp.task('prod', gulp.parallel('styles-min', 'scripts-min', 'twig', 'images'));

