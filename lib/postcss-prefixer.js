'use strict';

// Depedencies
var postcss = require('postcss');
var Tokenizer = require('css-selector-tokenizer');


// Constants
var PLUGIN_NAME = 'postcss-prefixer';

// Global variables
var _options = {
  prefix: '',
  ignore: []
};



function Prefixer(options) {
    _options.prefix = options.prefix ? options.prefix : '';
    _options.ignore = options.ignore ? options.ignore : []

    if (typeof _options.prefix !== 'string') {
      throw new Error('Err: Prefix should be of string type.');
    }

    if (!_options.ignore instanceof Array) {
      throw new Error('Err: ignore list must be an Array type');
    }

    return function(css) {
        css.walkRules(function(rule) {
            var parsedSelector = Tokenizer.parse(rule.selector);
            rule.selector = Tokenizer.stringify(prefixSelector(parsedSelector));
        })
    }
}



function prefixSelector(selector) {
    var len = selector.nodes.length;
    for (var i = 0; i < len; i++) {
        var node = selector.nodes[i];

        switch(node.type) {
            case 'selector':
            case 'nested-pseudo-class':
                prefixSelector(node);
                break;
            case 'id':
            case 'class':
                if (!isBlacklisted(node)) {
                    node.name = _options.prefix + node.name;
                }
                break;
            case 'attribute':
                var attr = parseAttributeSelector(node.content);
                if (attr && !isBlacklisted(attr)) {
                    attr.name = _options.prefix + attr.name;
                    selector.nodes[i].content = attr.stringify();
                }
                break;
            default:
                break;
        }
    }

    return selector;
}



/**
 * Check selector against ignore list and returns true if is listed to ignore
 *
 * @param {Object} node
 */
function isBlacklisted(node) {
    if (!_options.ignore) return false;

    var ignoreRulesLength = _options.ignore.length;
    var selector = Tokenizer.stringify(node);
    var isOnIgnoreList = false;

    for (var i = 0; i < ignoreRulesLength; i++) {
        var rule = _options.ignore[i];
        if (typeof(rule) === 'string' || rule instanceof String) {
            isOnIgnoreList = (rule === selector) ? true: false;
        }
        if (rule instanceof RegExp) {
            isOnIgnoreList = rule.exec(selector) ? true: false;
        }
        if (isOnIgnoreList) {
            return true;
        };
    }

    return false;
}



function parseAttributeSelector(content) {
    var CSS_ATTR_REGEX = /(^class|id)([*^?=]*)(\D*)/gi;

    content = content.split(CSS_ATTR_REGEX);
    for (var i = 0; i < content.length; i++) {
        if (!content[i].length) {
            content.splice(i, 1);
            i--;
            continue;
        }
        content[i] = content[i].trim().replace(/"|'/g, '');
    }

    if (!/^class|^id/.test(content[0])) return false;

    return {
        type: content[0],
        operator: content[1],
        name: content[2],
        stringify: function() {
            return this.type + this.operator + '"' + this.name + '"';
        }
    };
}

module.exports = postcss.plugin(PLUGIN_NAME, Prefixer);
