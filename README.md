angular-generator
=======

Just a simple wrapper to scaffold angular stuff in my setup. 

```js
var args = require('yargs').argv;
var gulp = require('gulp');
var ngenerate = require('angular-generator');

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
```

```bash
gulp g --type c mymodule:mycontroller
```

- `m` = complete module 
- `c` = controller
- `t` = template
- `p` = provider
- `d` = directive
