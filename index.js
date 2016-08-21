'use strict';

var postcss = require('postcss');

module.exports = postcss.plugin('postcss-prefixer', prefixer);

/**
 * Prefix all css classes and IDs
 *
 * @param  {String} prefix
 * @param  {Object} options
 */
function prefixer(prefix, opts) {
    opts = opts || {};
    var regex = /(\s*?[#\.][-\w\d\s,\>\~\+\:\&\(\)]+\s*?)/g;

    return function(css) {
        css.walkRules(function(rule) {
            var selectors = rule.selector.match(regex);

            if (selectors) {
                selectors = selectors.map(function(selector) {
                    if (!isValidSelector(selector) ||
                        matchIgnore(selector, opts.ignore)
                    ) {
                        return selector;
                    }

                    return selector.substr(0, 1) + prefix + selector.substr(1);
                });

                rule.selector = selectors.join('');
            }
        });
    }
}

/**
 * Check if given selector matchs ingore list
 *
 * @param  {String} selector [ selector to matched against the ignore]
 * @param  {Array} ignore [ ignore list ]
 * @return {Boolean}
 */
function matchIgnore(selector, ignore) {
    if (!ignore || ignore.constructor !== Array) {
        return false;
    }

    return ignore.some(function(test) {
        if (test.constructor === RegExp) {
            return test.exec(selector);
        } else if (test.constructor === String) {
            test = new RegExp(test);
            return test.exec(selector);
        }
    });
}

/**
 * Check if given selector is a class or ID
 *
 * @param  {String}  selector [ given selector to be valided ]
 * @return {Boolean}
 */
function isValidSelector(selector) {
    return selector.indexOf('.') === 0 || selector.indexOf('#') === 0;
}
