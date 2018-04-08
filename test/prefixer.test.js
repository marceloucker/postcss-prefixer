const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const postcssPrefixer = require('../lib/prefixer');


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

describe('Prefixer', () => {
  test('should not prefix selectors when prefix is undefined', () => {
    const { css } = postcss()
      .use(postcssPrefixer())
      .process(mocks.default.source);

    expect(css).toEqual(mocks.default.source);
  });

  test('should throw when passing invalid prefix type', () => {
    const results = postcss()
      .use(postcssPrefixer({ prefix: 123, ignore: [] }))
      .process(mocks.default.source);
    expect(() => results.css).toThrow();
  });

  test('should throw when passing invalid ignore type', () => {
    const results = postcss()
      .use(postcssPrefixer({ prefix: 'prefix-', ignore: '.to-ignore' }))
      .process(mocks.default.source);
    expect(() => results.css).toThrow();
  });

  test('should prefix all selectors', () => {
    const { css } = postcss()
      .use(postcssPrefixer({ prefix: 'prefix-' }))
      .process(mocks.default.source);

    expect(css).toEqual(mocks.default.expected);
  });

  test('should ignore selectors from ignore array option', () => {
    const { css } = postcss()
      .use(postcssPrefixer({
        prefix: 'prefix-',
        ignore: [
          /col-/,
          /component/,
          '.container',
          '.icon',
          '#page',
        ],
      })).process(mocks.ignore.source);

    expect(css).toEqual(mocks.ignore.expected);
  });

  test('should not fail if ignore values are functions or numbers', () => {
    const { css } = postcss()
      .use(postcssPrefixer({
        prefix: 'prefix-',
        ignore: [
          1,
          console.log,
          /col-/,
          /component/,
          '.container',
          '.icon',
          '#page',
        ],
      })).process(mocks.ignore.source);

    expect(css).toEqual(mocks.ignore.expected);
  });
});
