# postcss-prefixer [![Build Status](https://travis-ci.org/marceloucker/postcss-prefixer.svg?branch=master)](https://travis-ci.org/marceloucker/postcss-prefixer)
PostCSS plugin to prefix all classes and ids

## Installation

Before using the plugin, make sure to have installed the PostCSS before:

`npm install postcss`

After installing postcss you can install the plugin:

`npm install postcss-prefixer`


## Usage

```js

var postcss = require('postcss'),
    prefixer = require('postcss-prefixer');

var cssFile = fs.readFileSync('path/to/file.css',  'utf-8').toString();

var output = postcss().use(
    prefixer('prefix-', {
        ignore: [
            /col-/,
            '.class-to-ignore',
            '#id-to-ignore'
        ]
    })
).process(cssFile);    

```

## Example

Before:  
```css
#my-id {
    color: green;
}
.my-class {
    color: green;
}
.my-class .another-class {
    box-sizing: border-box;
}
.component.is-active.sub-component.is-disabled {
    box-sizing: border-box;
}
.class-to-ignore {
    color: blue;
}
```

After:  

```css
#prefix-my-id {
    color: green;
}
.prefix-my-class {
    color: green;
}
.prefix-my-class .prefix-another-class {
    box-sizing: border-box;
}
.prefix-component.prefix-is-active.prefix-sub-component.prefix-is-disabled {
    box-sizing: border-box;
}
.class-to-ignore {
    color: blue;
}
```


## Credits

 Plugin based on [postcss-class-prefix](https://github.com/thompsongl/postcss-class-prefix) create by [thompsongl](https://github.com/thompsongl).
