import '../testData/debtorDocumentSchema.mjs';

// The schema module is imported as the source-of-truth location for the contract.
// This file defines the app-level interpretation used by render/validation utilities.

export const FIELD_TYPES = Object.freeze({
  STRING: 'string',
  NUMBER: 'number',
  ARRAY: 'array',
  OBJECT: 'object',
});

export const FIELD_FALLBACKS = Object.freeze({
  [FIELD_TYPES.STRING]: 'Not provided',
  [FIELD_TYPES.NUMBER]: 'Not provided',
  [FIELD_TYPES.ARRAY]: [],
  [FIELD_TYPES.OBJECT]: null,
});

export const DOCUMENT_CONTRACT = Object.freeze({
  required: [
    { path: 'documentMetadata.source', type: FIELD_TYPES.STRING },
    { path: 'documentMetadata.documentType', type: FIELD_TYPES.STRING },
    { path: 'documentMetadata.extractionDate', type: FIELD_TYPES.STRING },
    { path: 'totalAmount', type: FIELD_TYPES.NUMBER },
    { path: 'numberOfCases', type: FIELD_TYPES.NUMBER },
    { path: 'debtCollector', type: FIELD_TYPES.STRING },
    { path: 'cases', type: FIELD_TYPES.ARRAY },
    { path: 'cases[].identifiers.caseNumber', type: FIELD_TYPES.STRING },
    { path: 'cases[].amounts.totalAmount', type: FIELD_TYPES.NUMBER },
    { path: 'cases[].amounts.principalAmount', type: FIELD_TYPES.NUMBER },
    { path: 'cases[].parties.debtCollector', type: FIELD_TYPES.STRING },
  ],
  optional: [
    { path: 'documentMetadata.pdfPath', type: FIELD_TYPES.STRING },
    { path: 'documentMetadata.pdfLink', type: FIELD_TYPES.STRING },
    { path: 'documentMetadata.documentDate', type: FIELD_TYPES.STRING },
    { path: 'cases[].identifiers.referenceNumber', type: FIELD_TYPES.STRING },
    { path: 'cases[].identifiers.customerNumber', type: FIELD_TYPES.STRING },
    { path: 'cases[].amounts.interest', type: FIELD_TYPES.NUMBER },
    { path: 'cases[].amounts.fees', type: FIELD_TYPES.NUMBER },
    { path: 'cases[].amounts.collectionFees', type: FIELD_TYPES.NUMBER },
    { path: 'cases[].amounts.interestOnCosts', type: FIELD_TYPES.NUMBER },
    { path: 'cases[].dates.invoiceDate', type: FIELD_TYPES.STRING },
    { path: 'cases[].dates.originalDueDate', type: FIELD_TYPES.STRING },
    { path: 'cases[].dates.issuedDate', type: FIELD_TYPES.STRING },
    { path: 'cases[].dates.paymentDeadline', type: FIELD_TYPES.STRING },
    { path: 'cases[].parties.currentCreditor', type: FIELD_TYPES.STRING },
    { path: 'cases[].parties.originalCreditor', type: FIELD_TYPES.STRING },
    { path: 'cases[].parties.debtor', type: FIELD_TYPES.OBJECT },
    { path: 'cases[].parties.debtor.name', type: FIELD_TYPES.STRING },
    { path: 'cases[].parties.debtor.nationalId', type: FIELD_TYPES.STRING },
    { path: 'cases[].parties.debtor.address', type: FIELD_TYPES.OBJECT },
    { path: 'cases[].parties.debtor.address.street', type: FIELD_TYPES.STRING },
    { path: 'cases[].parties.debtor.address.postalCode', type: FIELD_TYPES.STRING },
    { path: 'cases[].parties.debtor.address.city', type: FIELD_TYPES.STRING },
    { path: 'cases[].parties.debtor.address.country', type: FIELD_TYPES.STRING },
    { path: 'cases[].details', type: FIELD_TYPES.OBJECT },
    { path: 'cases[].details.caseStatus', type: FIELD_TYPES.STRING },
    { path: 'cases[].details.description', type: FIELD_TYPES.STRING },
    { path: 'cases[].details.basisForClaim', type: FIELD_TYPES.STRING },
    { path: 'cases[].details.invoices', type: FIELD_TYPES.ARRAY },
    { path: 'cases[].details.claimType', type: FIELD_TYPES.STRING },
    { path: 'cases[].details.notes', type: FIELD_TYPES.STRING },
    { path: 'cases[].details.invoices[].invoiceNumber', type: FIELD_TYPES.STRING },
    { path: 'cases[].details.invoices[].invoiceDate', type: FIELD_TYPES.STRING },
    { path: 'cases[].details.invoices[].dueDate', type: FIELD_TYPES.STRING },
    { path: 'cases[].details.invoices[].amount', type: FIELD_TYPES.NUMBER },
    { path: 'cases[].details.invoices[].description', type: FIELD_TYPES.STRING },
  ],
});

export function getFallbackForType(type) {
  return Object.prototype.hasOwnProperty.call(FIELD_FALLBACKS, type)
    ? FIELD_FALLBACKS[type]
    : null;
}
