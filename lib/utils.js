module.exports = {

  itMatchsOne(arr, term) {
    return arr.some(i => term.search(i) >= 0);
  },

  parseAttrSelector(node) {
    const { content } = node;

    const regx = /(^class|^id)([*^?~|$=]*)(\D*)/gi;

    const [type, operator, name] = content
      .split(regx)
      .filter(part => part.length)
      .map(part => part.trim().replace(/"|'/g, ''));

    return { type, operator, name };
  },

  attrStringify({ type, operator, name }) {
    return `${type}${operator}"${name}"`;
  },

};
