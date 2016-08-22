'use strict';

var postcss = require('postcss'),
    Tokenizer = require('css-selector-tokenizer');

module.exports = postcss.plugin('postcss-prefixer', function(prefix, opts) {
    opts = opts || {};

    return function(css) {
        css.walkRules(function(rule) {
            var selector = Tokenizer.parse(rule.selector);
            rule.selector = Tokenizer.stringify(prefixer(selector));
        });
    };

    function prefixer(selector) {
        var types = /^class|^id/;

        selector.nodes.map(function(node) {
            return node.nodes.map(function(n) {
                if(n.type === 'selector') { prefixer(n); }

                if (types.test(n.type) && !isIgnored(n)) {
                    n.name = prefix + n.name;
                } else if (n.type === 'nested-pseudo-class') {
                    prefixer(n);
                }
            });
        });

        return selector;
    }


    function isIgnored(node) {
        if (!opts.ignore || opts.ignore.constructor !== Array) {
            return false;
        }

        var selector = node.name;

        switch (node.type) {
            case 'class':
                selector = '.' + selector;
                break;
            case 'id':
                selector = '#' + selector;
                break;
            default:
                break;
        }

        return opts.ignore.some(function(test) {
            if (test.constructor === RegExp) {
                return test.exec(selector);
            } else if (test.constructor === String) {
                return test === selector;
            }
        });
    }
});
