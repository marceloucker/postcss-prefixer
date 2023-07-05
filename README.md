# postcss-prefixer
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Usage]: https://github.com/postcss/postcss#usage

A [PostCSS] plugin to prefix css selectors.

````css
/* source css file */

#selector { /* content */ }

.selector { /* content */ }

.selector:hover { /* content */ }

.selector__element { /* content */ }
````

````css
/* output css file prefixed with "prfx__" */

#prfx__selector { /* content */ }

.prfx__selector { /* content */ }

.prfx__selector:hover { /* content */ }

.prfx__selector__element { /* content */ }
````

## Usage

`npm i -D postcss postcss-prefixer` or `yarn add -D postcss postcss-prefixer`

create a `postcss.config.js` with:
```js
module.exports = {
  plugins: [
    require('postcss-prefixer')({ /* options */ })
  ]
}
```

> Refer to [PostCSS Usage] on how to use it with your preferred build tool.

#### Example
```js
const postcss = require('postcss');
const prefixer = require('postcss-prefixer');

const input = fs.readFileSync('path/to/file.css',  'utf-8');

const output = postcss([
  prefixer({
        prefix: 'prefix-',
        ignore: [ /selector-/, '.ignore', '#ignore' ],
        ignoreFiles: [ /.module.scss/ ]
    })
]).process(input);
```

#### Options
| Name                  | Description                                |
|-----------------------|--------------------------------------------|
| `prefix` (string)     | prefix value to be used                    |
| `ignore` (array)      | list of selectors to ignore, accepts regex |
| `ignoreFiles` (array) | list of files to ignore, accepts regex     |


## Credits

 Plugin based on [postcss-class-prefix](https://github.com/thompsongl/postcss-class-prefix) create by [thompsongl](https://github.com/thompsongl).
