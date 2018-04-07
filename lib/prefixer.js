const postcss = require('postcss');
const Tokenizer = require('css-selector-tokenizer');
const {
  parseAttrSelector,
  attrStringify,
  itMatchsOne,
} = require('./utils');


const prefixNode = (node, prefix) => {
  if (['class', 'id'].includes(node.type)) {
    return Object.assign({}, node, { name: `${prefix}${node.name}` });
  }

  if (['attribute'].includes(node.type) && node.content) {
    const { type, operator, name } = parseAttrSelector(node);

    if (!['class', 'id'].includes(type)) return node;

    return Object.assign({}, node, {
      content: attrStringify({
        type,
        operator,
        name: `${prefix}${name}`,
      }),
    });
  }

  return node;
};

const interateSelectorNodes = (selector, options) =>
  Object.assign({}, selector, {
    nodes: selector.nodes.map((node) => {
      if (['selector', 'nested-pseudo-class'].includes(node.type)) {
        return interateSelectorNodes(node, options);
      }

      if (itMatchsOne(options.ignore, Tokenizer.stringify(node))) return node;

      return prefixNode(node, options.prefix);
    }),
  });


const prefixer = ({ prefix = '', ignore = [] }) => (css) => {
  if (typeof prefix !== 'string') {
    throw new Error('prefix must be of string type');
  }

  if (!Array.isArray(ignore)) {
    throw new Error('ignore should be an array');
  }

  css.walkRules((rule) => {
    const { selector } = rule;

    rule.selector = Tokenizer.stringify(interateSelectorNodes(
      Tokenizer.parse(selector),
      { prefix, ignore },
    ));
  });
};

module.exports = postcss.plugin('postcss-prefixer', prefixer);
