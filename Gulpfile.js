var args = require('yargs').argv;
var gulp = require('gulp');
var ngenerate = require('.');

gulp.task('g', function() {
    var c = new ngenerate({
        base: './tmp',
        test: './test',
        appname: 'super'
    });

    if(args.type) {
        c.scaffold(args.type, args.name);
    }
});