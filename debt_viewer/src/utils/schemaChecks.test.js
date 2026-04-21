import { checkDocumentStructure } from './schemaChecks';
import mockDocument from '../testData/norsk/mock_debtor_document_norsk.json';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

describe('checkDocumentStructure', () => {
  test('marks complete mock document as valid', () => {
    const result = checkDocumentStructure(clone(mockDocument));

    expect(result.isValid).toBe(true);
    expect(result.requiredIssues).toHaveLength(0);
  });

  test('reports missing required field', () => {
    const broken = clone(mockDocument);
    delete broken.antallSaker;

    const result = checkDocumentStructure(broken);

    expect(result.isValid).toBe(false);
    expect(result.requiredIssues.some((issue) => issue.path === 'antallSaker')).toBe(true);
  });

  test('reports malformed required value type', () => {
    const malformed = clone(mockDocument);
    malformed.antallSaker = 'two';

    const result = checkDocumentStructure(malformed);

    expect(result.isValid).toBe(false);
    expect(result.requiredIssues.some((issue) => issue.path === 'antallSaker')).toBe(true);
  });
});
