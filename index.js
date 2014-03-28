var path = require('path');
var mkdirp = require('mkdirp');
var handlebars = require('handlebars');
var fs = require('fs');


function ngenerate (options) {
    this.base = options.base;
    this.templates = options.templates || path.join(__dirname, 'templates');
    this.test = options.test;
    this.appname = options.appname;
}

ngenerate.prototype.controller = function (module, controllerName) {
    var self = this;
    this.write('controller.hbs', {
        name: controllerName,
        path: path.join(self.base, module, 'controllers')
    });

    this.write('controller_test.hbs', {
        name: controllerName,
        module: module,
        appname: self.appname,
        path: path.join(self.test, module, 'controllers')
    });
};

ngenerate.prototype.directive = function (module, directiveName) {
    var self = this;
    this.write('directive.hbs', {
        name: directiveName,
        path: path.join(self.base, module, 'directives')
    });

    this.write('directive_test.hbs', {
        name: directiveName,
        module: module,
        appname: self.appname,
        path: path.join(self.test, module, 'directives')
    });
};

ngenerate.prototype.template = function (module, templateName) {
    var self = this;
    this.write('template.hbs', {
        name: templateName,
        ext: 'html',
        path: path.join(self.base, module, 'templates')
    });
};

ngenerate.prototype.index = function (module) {
    var self = this;
    this.write('index.hbs', {
        name: 'index',
        module: module,
        appname: self.appname,
        path: path.join(self.base, module)
    });
};

ngenerate.prototype.provider = function (module, providerName) {
    var self = this;
    this.write('provider.hbs', {
        name: providerName,
        path: path.join(self.base, module, 'providers')
    });

    this.write('provider_test.hbs', {
        name: providerName,
        module: module,
        appname: self.appname,
        path: path.join(self.test, module, 'providers')
    });
};

ngenerate.prototype.module = function (module) {
    var self = this;
    // We check if it exists
    if (fs.existsSync(path.join(self.base, module))) {
        console.log('MODULE ALREADY EXISTS: ' + path.join(self.base, module));
        return false;
    }

    ['controllers', 'providers', 'directives', 'filters', 'templates'].forEach(function(item) {
        if(item !== 'templates') mkdirp.sync(path.join(self.test, module, item));
        mkdirp.sync(path.join(self.base, module, item));
    });
    self.index(module);
    self.controller(module, module);
    self.template(module, module);
}

ngenerate.prototype.write = function (template, opts) {
    opts.fp = path.join(opts.path, opts.name) + '.' + (opts.ext ? opts.ext : 'js');
    mkdirp.sync(opts.path);
    var gc = fs.readFileSync(path.join(this.templates, template));
    var t = handlebars.compile(gc.toString());
    fs.writeFileSync(opts.fp, t(opts));
};

ngenerate.prototype.scaffold = function (type, name) {
    var self = this;

    if(type === 'm') {
        return this.module(name);
    }
    var sname = name.split(':');
    if(sname.length !== 2) {
        console.log('Please Provide the name as in module:name. eg: admin:list');
        return false;
    }

    if(type === 'c') {
        return this.module(sname[0], sname[1]);
    }

    if(type === 'd') {
        return this.directive(sname[0], sname[1]);
    }

    if(type === 't') {
        return this.template(sname[0], sname[1]);
    }

    if(type === 'p') {
        return this.provider(sname[0], sname[1]);
    }
};

module.exports = ngenerate;