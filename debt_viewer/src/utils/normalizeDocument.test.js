import { normalizeDocument } from './normalizeDocument';
import mockDocument from '../testData/norsk/mock_debtor_document_norsk.json';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

describe('normalizeDocument', () => {
  test('returns normalized document and validation object', () => {
    const result = normalizeDocument(clone(mockDocument));

    expect(result.normalizedDocument).toBeDefined();
    expect(result.validation).toBeDefined();
    expect(typeof result.validation.isValid).toBe('boolean');
  });

  test('fills missing optional nested string fields with fallback', () => {
    const doc = clone(mockDocument);
    delete doc.saker[0].parter.skyldner.adresse.poststed;

    const result = normalizeDocument(doc);

    expect(result.normalizedDocument.saker[0].parter.skyldner.adresse.poststed).toBe('Not provided');
  });

  test('handles non-object input defensively', () => {
    const result = normalizeDocument(null);

    expect(result.normalizedDocument).toBeDefined();
    expect(result.normalizedDocument.dokumentMetadata).toBeDefined();
    expect(result.normalizedDocument.saker).toEqual([]);
    expect(result.normalizedDocument.totalbelop).toBe('Not provided');
    expect(result.validation.isValid).toBe(false);
  });
});
