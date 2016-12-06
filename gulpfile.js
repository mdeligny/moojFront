const gulp = require('gulp');
const HubRegistry = require('gulp-hub');
const browserSync = require('browser-sync');

const conf = require('./conf/gulp.conf');

// Load some files into the registry
const hub = new HubRegistry([conf.path.tasks('*.js')]);

var ftp = require('vinyl-ftp');
var gutil = require('gulp-util');
var minimist = require('minimist');
var args = minimist(process.argv.slice(2));

// Tell gulp to use the tasks just loaded
gulp.registry(hub);

gulp.task('inject', gulp.series(gulp.parallel('styles', 'scripts'), 'inject'));
gulp.task('build', gulp.series('partials', gulp.parallel('inject', 'other'), 'build'));

gulp.task('test', gulp.series('scripts', 'karma:single-run'));
gulp.task('test:auto', gulp.series('watch', 'karma:auto-run'));

gulp.task('serve', gulp.series('inject', 'watch', 'browsersync'));
gulp.task('serve:dist', gulp.series('default', 'browsersync:dist'));


gulp.task('default', gulp.series('clean', 'build'));


gulp.task('watch', watch);

gulp.task('deploy', deploy);

function deploy(done) {
  var remotePath = '/mooj';
  var conn = ftp.create({
    host: 'ftp.cluster015.ovh.net',
    user: args.user,
    password: args.password,
    log: gutil.log
  });

  var globs = [
    'fonts/**',
    'img/**',
    'maps/**',
    'scripts/**',
    'styles/**',
    'index.html',
    //conf.path.dist('fonts/**'),
    //conf.path.dist('img/**'),
    //conf.path.dist('maps/**'),
    //conf.path.dist('scripts/**'),
    //conf.path.dist('styles/**'),
    //conf.path.dist('index.html')
  ];

  gulp.src(globs, {cwd: 'dist', base: 'dist', buffer: false})
    //    .pipe(conn.newer(remotePath))
    .pipe(conn.dest(remotePath));
  done();
}

function reloadBrowserSync(cb) {
  browserSync.reload();
  cb();
}

function watch(done) {
  gulp.watch([
    conf.path.src('index.html'),
    'bower.json'
  ], gulp.parallel('inject'));

  gulp.watch(conf.path.src('app/**/*.html'), reloadBrowserSync);
  gulp.watch([
    conf.path.src('**/*.css')
  ], gulp.series('styles'));
  gulp.watch(conf.path.src('**/*.js'), gulp.series('inject'));
  done();
}