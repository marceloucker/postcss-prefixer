const postcss = require('postcss');
const Tokenizer = require('css-selector-tokenizer');


function isIgnored(node, ignore = []) {
  const selector = Tokenizer.stringify(node);

  return ignore.some((rule) => {
    if (typeof rule === 'string') return rule === selector;
    const regex = new RegExp(rule);
    return regex.test(selector);
  });
}


function parseAttributeSelector(node) {
  if (!node.content) return node;
  const CSS_ATTR_REGEX = /(^class|id)([*^?=]*)(\D*)/gi;

  const attr = node.content
    .split(CSS_ATTR_REGEX)
    .filter(part => part.length)
    .map(part => part.trim().replace(/"|'/g, ''));


  if (!/^class|^id/.test(attr[0])) return false;

  return {
    type: attr[0],
    operator: attr[1],
    name: attr[2],
    stringify() {
      return `${this.type}${this.operator}"${this.name}"`;
    },
  };
}


function prefixSelector(selector, prefix, ignore) {
  const nodes = selector.nodes.map((node) => {
    if (/^selector|nested-pseudo-class$/.test(node.type)) {
      return prefixSelector(node, prefix, ignore);
    }

    if (/^attribute$/.test(node.type)) {
      const attr = parseAttributeSelector(node);
      if (!attr || isIgnored(attr, ignore)) return node;
      attr.name = `${prefix}${attr.name}`;
      return Object.assign({}, node, { content: attr.stringify() });
    }

    if (/^class|id$/.test(node.type) && !isIgnored(node, ignore)) {
      return Object.assign({}, node, { name: `${prefix}${node.name}` });
    }

    return node;
  });

  return Object.assign({}, selector, { nodes });
}


function prefixer({ prefix = '', ignore = [] }) {
  if (typeof prefix !== 'string') {
    throw new Error('Err: Prefix should be of string type.');
  }

  if (!Array.isArray(ignore)) {
    throw new Error('Err: ignore list must be an Array type');
  }

  return (css) => {
    css.walkRules((rule) => {
      const selector = Tokenizer.parse(rule.selector);
      const prefixedSelector = prefixSelector(selector, prefix, ignore);

      rule.selector = Tokenizer.stringify(prefixedSelector);
    });
  };
}

module.exports = postcss.plugin('postcss-prefixer', prefixer);
