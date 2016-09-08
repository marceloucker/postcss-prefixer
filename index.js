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

    /**
     * [prefixer description]
     * @param  {[type]} selector [description]
     * @return {[type]}          [description]
     */
    function prefixer(selector) {
        var types = /^class|^id/;

        selector.nodes.map(function(node) {
            return node.nodes.map(function(n) {
                if (n.type === 'selector') {
                    prefixer(n);
                }
                if (types.test(n.type) && !isIgnored(n)) {
                    n.name = prefix + n.name;
                } else if (n.type === 'nested-pseudo-class') {
                    prefixer(n);
                } else if (n.type === 'attribute') {
                    var attrObj = parseAttributeSelector(n.content);
                    if (attrObj && !isIgnored(attrObj)) {
                        attrObj.name = prefix + attrObj.name;
                        n.content = attrObj.stringify();
                    }
                }
            });
        });

        return selector;
    }


    /**
     * Parse node of type attribute content string to object
     * ez: [class*="col-"] to
     * {type: 'class', name: 'col-', operator: '*='}
     *
     * @param  {[type]} content [description]
     * @return {[type]}         [description]
     */
    function parseAttributeSelector(content) {
        content = content.split(/(^class|id)([*^?=]*)(\D*)/gi)
            .filter(function(value) {
                return value.length && value !== '';
            }).map(function(value) {
                return value.trim().replace(/"|'/g, '');
            });

        if (!/^class|id/.test(content[0])) {
            return false;
        }

        return {
            type: content[0],
            operator: content[1],
            name: content[2],
            stringify: function() {
                return this.type + this.operator + '"' + this.name + '"';
            }
        };
    }

    /**
     * Check if given node is on ignore list
     *
     * @param  {Object}  node
     * @return {Boolean}
     */
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
