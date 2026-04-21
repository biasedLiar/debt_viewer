import { hasExpectedType, isMissingValue, safeGet } from './safeGet';

describe('safeGet', () => {
  const source = {
    root: {
      value: 42,
      nested: {
        label: 'hello',
      },
    },
    cases: [
      { identifiers: { caseNumber: 'A-1' } },
      { identifiers: { caseNumber: 'A-2' } },
    ],
  };

  test('reads a simple nested path', () => {
    expect(safeGet(source, 'root.nested.label')).toBe('hello');
  });

  test('returns default for missing path', () => {
    expect(safeGet(source, 'root.unknown.value', 'fallback')).toBe('fallback');
  });

  test('reads wildcard array path', () => {
    expect(safeGet(source, 'cases[].identifiers.caseNumber', [])).toEqual(['A-1', 'A-2']);
  });
});

describe('isMissingValue', () => {
  test('detects empty string and nullish values', () => {
    expect(isMissingValue('')).toBe(true);
    expect(isMissingValue('   ')).toBe(true);
    expect(isMissingValue(null)).toBe(true);
    expect(isMissingValue(undefined)).toBe(true);
    expect(isMissingValue('ok')).toBe(false);
  });
});

describe('hasExpectedType', () => {
  test('checks known expected types', () => {
    expect(hasExpectedType('abc', 'string')).toBe(true);
    expect(hasExpectedType(12.4, 'number')).toBe(true);
    expect(hasExpectedType([], 'array')).toBe(true);
    expect(hasExpectedType({ a: 1 }, 'object')).toBe(true);
    expect(hasExpectedType('', 'string')).toBe(false);
    expect(hasExpectedType(NaN, 'number')).toBe(false);
  });
});
