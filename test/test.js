var assert = require('assert');
var fs = require('fs');
var postcss = require('postcss');
var cssPrefixer = require('..');

function fixture(name) {
    return fs.readFileSync('test/fixtures/' + name, 'utf8').trim();
}

describe('postcss-css-prefixer', function() {
    it('prefix all classes & ids', function() {
        var result = postcss()
            .use(cssPrefixer('prefix-'))
            .process(fixture('source.css')).css;

        var expected = fixture('source.expected.css');
        assert.equal(result, expected);
    });

    it('will not prefix classes & ids in ignore list', function() {
        var result = postcss()
            .use(cssPrefixer('prefix-', {
                ignore: [
                    /col-[a-z-]+/,
                    /Component-/,
                    '.should-ignore',
                    '.should-also-ignore',
                    '.container',
                    '.row'
                ]
            }))
            .process(fixture('ignore.css')).css;

        var expected = fixture('ignore.expected.css');
        assert.equal(result, expected);
    });
});
