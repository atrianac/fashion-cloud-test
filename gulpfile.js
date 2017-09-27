const gulp = require('gulp');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

const tsProject = ts.createProject('tsconfig.json');
const mocha = require('gulp-mocha');
const shell = require('gulp-shell')

gulp.task('scripts', () => {
  const tsResult = tsProject.src()
  .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('watch', ['scripts'], () => {
  gulp.watch('src/**/*.ts', ['scripts']);
});

gulp.task('assets', function() {
  return gulp.src(JSON_FILES)
  .pipe(gulp.dest('dist'));
});

gulp.task('test', function() {
    return gulp.src('test/service/*.ts')
    .pipe(mocha({
        reporter: 'nyan',
        require: ['ts-node/register']
    }));
});

gulp.task('coverage', shell.task([
  "nyc mocha"
]))

gulp.task('default', ['watch', 'assets']);