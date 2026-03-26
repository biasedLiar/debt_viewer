import { DOCUMENT_CONTRACT, getFallbackForType } from './documentContract';
import { checkDocumentStructure } from './schemaChecks';
import { isMissingValue, tokenizePath } from './safeGet';

function isObjectLike(value) {
  return value !== null && typeof value === 'object';
}

function cloneDocument(rawDocument) {
  if (!isObjectLike(rawDocument)) {
    return {};
  }

  return JSON.parse(JSON.stringify(rawDocument));
}

function cloneFallback(fallbackValue) {
  if (Array.isArray(fallbackValue)) {
    return [...fallbackValue];
  }

  if (isObjectLike(fallbackValue)) {
    return { ...fallbackValue };
  }

  return fallbackValue;
}

function assignFallbackAtPath(target, tokens, fallbackValue, index = 0) {
  if (!isObjectLike(target) || index >= tokens.length) {
    return;
  }

  const token = tokens[index];
  const isArrayToken = token.endsWith('[]');
  const key = isArrayToken ? token.slice(0, -2) : token;

  if (isArrayToken) {
    const arrayValue = target[key];

    if (!Array.isArray(arrayValue)) {
      return;
    }

    if (index === tokens.length - 1) {
      return;
    }

    arrayValue.forEach((item) => assignFallbackAtPath(item, tokens, fallbackValue, index + 1));
    return;
  }

  if (index === tokens.length - 1) {
    if (isMissingValue(target[key])) {
      target[key] = cloneFallback(fallbackValue);
    }
    return;
  }

  if (!isObjectLike(target[key])) {
    target[key] = {};
  }

  assignFallbackAtPath(target[key], tokens, fallbackValue, index + 1);
}

function applyContractFallbacks(document, contract) {
  [...contract.required, ...contract.optional].forEach((entry) => {
    const fallbackValue = getFallbackForType(entry.type);
    const tokens = tokenizePath(entry.path);

    if (tokens.length === 0) {
      return;
    }

    assignFallbackAtPath(document, tokens, fallbackValue, 0);
  });

  return document;
}

export function normalizeDocument(rawDocument, contract = DOCUMENT_CONTRACT) {
  const normalizedDocument = applyContractFallbacks(cloneDocument(rawDocument), contract);
  const validation = checkDocumentStructure(normalizedDocument, contract);

  return {
    normalizedDocument,
    validation,
  };
}
