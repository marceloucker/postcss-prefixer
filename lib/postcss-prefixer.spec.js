'use strict';

// Depedencies
const fs = require('fs');
const path = require('path');
const test = require('tape');
const postcss = require('postcss');
const postcssPrefixer = require('./postcss-prefixer');

// Constants
const DEFAULT_SOURCE_PATH = path.resolve(__dirname, '../mocks/source.css')
const DEFAULT_EXPECTED_PATH = path.resolve(__dirname, '../mocks/source.expected.css')
const IGNORE_SOURCE_PATH = path.resolve(__dirname, '../mocks/ignore.css')
const IGNORE_EXPECTED_PATH = path.resolve(__dirname, '../mocks/ignore.expected.css')

const mocks = {
    default: {
        source: fs.readFileSync(DEFAULT_SOURCE_PATH, 'utf8').trim(),
        expected: fs.readFileSync(DEFAULT_EXPECTED_PATH, 'utf8').trim(),
    },
    ignore: {
        source: fs.readFileSync(IGNORE_SOURCE_PATH, 'utf8').trim(),
        expected: fs.readFileSync(IGNORE_EXPECTED_PATH, 'utf8').trim(),
    }
}

test('it will prefix all selectors', (assert) => {
    const actual = postcss()
        .use(postcssPrefixer({ prefix: 'prefix-' }))
        .process(mocks.default.source)
        .css;

    assert.equal(actual, mocks.default.expected, 'Expected to prefix all selectors (class & ids)');
    assert.end();
});

test('it will ignore selectors on ignore list', (assert) => {
    const actual = postcss()
        .use(postcssPrefixer({
            prefix: 'prefix-',
            ignore: [
                /col-/,
                /Component-/,
                '.row',
                '.container',
                '.should-ignore',
                '.should-also-ignore'
            ]
        }))
        .process(mocks.ignore.source)
        .css;

    assert.equal(actual, mocks.ignore.expected, 'Expected to prefix all selectors (class & ids)');
    assert.end();
});
