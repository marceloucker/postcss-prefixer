const Tokenizer = require('css-selector-tokenizer');
const {
  parseAttrSelector,
  attrStringify,
  itMatchesOne,
} = require('./utils');


const prefixNode = (node, prefix) => {
  if (['class', 'id'].includes(node.type)) {
    return Object.assign({}, node, { name: `${prefix}${node.name}` });
  }

  if (['attribute'].includes(node.type) && node.content) {
    const {
      type, operator, head, classes, foot,
    } = parseAttrSelector(node);

    if (!['class', 'id'].includes(type)) return node;

    return Object.assign({}, node, {
      content: attrStringify({
        type,
        operator,
        head,
        classes: classes.map((cls) => `${prefix}${cls}`),
        foot,
      }),
    });
  }

  return node;
};

const interateSelectorNodes = (selector, options) => Object.assign({}, selector, {
  nodes: selector.nodes.map((node) => {
    if (['selector', 'nested-pseudo-class'].includes(node.type)) {
      return interateSelectorNodes(node, options);
    }

    if (itMatchesOne(options.ignore, Tokenizer.stringify(node))) return node;

    return prefixNode(node, options.prefix);
  }),
});

function isFileInArray(file, arr) {
  return arr.some((ruleOrString) => {
    if (ruleOrString instanceof RegExp) {
      return ruleOrString.test(file);
    }

    return file.includes(ruleOrString);
  });
}


const prefixer = (options) => {
  const { prefix, ignore, ignoreFiles } = Object.assign({}, {
    prefix: '',
    ignore: [],
    ignoreFiles: []
  }, options);

  if (typeof prefix !== 'string') {
    throw new Error('@postcss-prefix: prefix option should be of type string.');
  }

  if (!Array.isArray(ignore)) {
    throw new Error('@postcss-prefix: ignore options should be an Array.');
  }

  if (!Array.isArray(ignoreFiles)) {
    throw new Error('@postcss-prefix: ignoreFiles options should be an Array.');
  }

  return {
    postcssPlugin: 'postcss-prefixer',
    Once(css) {
      if (!prefix.length) return;

      if (
        ignoreFiles.length &&
        css.source.input.file &&
        isFileInArray(css.source.input.file, ignoreFiles)
      ) {
        return;
      }

      css.walkRules((rule) => {
        const parsed = Tokenizer.parse(rule.selector);
        const selector = interateSelectorNodes(parsed, { prefix, ignore });

        /* eslint no-param-reassign: "off" */
        rule.selector = Tokenizer.stringify(selector);
      });
    },
  };
};
prefixer.postcss = true;

module.exports = prefixer;
