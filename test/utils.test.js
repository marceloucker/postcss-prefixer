const utils = require('../lib/utils');


describe('utls.itMatchsOne()', () => {
  test('should fail with non string search term', () => {
    expect(() => {
      utils.itMatchsOne(['1', '2'], 2);
    }).toThrow();
  });

  test('search term should match one of the array entries', () => {
    const result = utils.itMatchsOne(['lorem', 'ipsum'], 'ipsum');
    expect(result).toBe(true);
  });

  test('search term should NOT match one of the array entries', () => {
    const result = utils.itMatchsOne(['lorem', 'ipsum'], 'dolor');
    expect(result).toBe(false);
  });
});


describe('utls.parseAttrSelector()', () => {
  test('should fail if node content is undefined', () => {
    expect(() => utils.parseAttrSelector({ type: 'class' })).toThrow();
  });

  test('should return an object with type, operator, head and clsses keys', () => {
    const result = utils.parseAttrSelector({ content: 'class^="col-"' });

    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('operator');
    expect(result).toHaveProperty('head');
    expect(result).toHaveProperty('classes');
  });
});


describe('utls.attrStringify()', () => {
  test('should return stringified attribute', () => {
    const attr = utils.parseAttrSelector({ content: 'class^="col-"' });
    const result = utils.attrStringify(attr);

    expect(result).toEqual('class^="col-"');
  });
});
