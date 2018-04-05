

// Depedencies
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const postcssPrefixer = require('../lib/prefixer');

// Constants
const DEFAULT_SOURCE_PATH = path.resolve(__dirname, 'fixtures/source.css');
const DEFAULT_EXPECTED_PATH = path.resolve(__dirname, 'fixtures/source.expected.css');
const IGNORE_SOURCE_PATH = path.resolve(__dirname, 'fixtures/ignore.css');
const IGNORE_EXPECTED_PATH = path.resolve(__dirname, 'fixtures/ignore.expected.css');

const mocks = {
  default: {
    source: fs.readFileSync(DEFAULT_SOURCE_PATH, 'utf8').trim(),
    expected: fs.readFileSync(DEFAULT_EXPECTED_PATH, 'utf8').trim(),
  },
  ignore: {
    source: fs.readFileSync(IGNORE_SOURCE_PATH, 'utf8').trim(),
    expected: fs.readFileSync(IGNORE_EXPECTED_PATH, 'utf8').trim(),
  },
};

test('should prefix all selectors', () => {
  const { css } = postcss()
    .use(postcssPrefixer({ prefix: 'prefix-' }))
    .process(mocks.default.source);

  expect(css).toEqual(mocks.default.expected);
});

test('should ignore selectors from ignore list', () => {
  const { css } = postcss()
    .use(postcssPrefixer({
      prefix: 'prefix-',
      ignore: [
        /col-/,
        /Component-/,
        '.row',
        '.container',
        '.should-ignore',
        '.should-also-ignore',
      ],
    })).process(mocks.ignore.source);

  expect(css).toEqual(mocks.ignore.expected);
});
