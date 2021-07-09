const utils = require('../lib/utils');


describe('utils.itMatchesOne()', () => {
  test('should fail with non string search term', () => {
    expect(() => {
      utils.itMatchesOne(['1', '2'], 2);
    }).toThrow();
  });

  test('search term should match one of the array entries', () => {
    const result = utils.itMatchesOne(['lorem', 'ipsum'], 'ipsum');
    expect(result).toBe(true);
  });

  test('search term should NOT match one of the array entries', () => {
    const result = utils.itMatchesOne(['lorem', 'ipsum'], 'dolor');
    expect(result).toBe(false);
  });
});


describe('utils.parseAttrSelector()', () => {
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


describe('utils.attrStringify()', () => {
  test('should return stringified attribute', () => {
    const attr = utils.parseAttrSelector({ content: 'class^="col-"' });
    const result = utils.attrStringify(attr);

    expect(result).toEqual('class^="col-"');
  });

  test('should handle plain class', () => {
    const attr = utils.parseAttrSelector({ type: 'attribute', content: 'class' });
    const result = utils.attrStringify(attr);

    expect(result).toEqual('class');
  });
});
