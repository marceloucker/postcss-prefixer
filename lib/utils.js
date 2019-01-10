module.exports = {

  itMatchsOne(arr, term) {
    return arr.some(i => term.search(i) >= 0);
  },

  parseAttrSelector(node) {
    const { content } = node;
    const regex = /(^class|^id)([*^?~|$=]*)+("\s?)(\D*)/gi;

    const [type, operator, head, classes] = content
      .split(regex)
      .filter(part => part.length);

    return {
      type,
      operator,
      head,
      classes: classes ? classes.split(' ').map(c => c.replace(/"|'/g, '')) : [],
    };
  },

  attrStringify({
    type, operator, head, classes,
  }) {
    return `${type}${operator}${head}${classes.join(' ')}"`;
  },

};
