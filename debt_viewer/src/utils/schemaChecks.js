import { DOCUMENT_CONTRACT } from './documentContract';
import { hasExpectedType, isMissingValue, safeGet } from './safeGet';

function formatIssue({ level, path, message, expectedType, value }) {
  return {
    level,
    path,
    message,
    expectedType,
    actualType: Array.isArray(value) ? 'array' : typeof value,
    value,
  };
}

function checkSimplePath(document, entry, level) {
  const value = safeGet(document, entry.path, undefined);
  const issues = [];

  if (isMissingValue(value)) {
    issues.push(
      formatIssue({
        level,
        path: entry.path,
        expectedType: entry.type,
        value,
        message: `${level === 'error' ? 'Missing required field' : 'Missing optional field'}: ${entry.path}`,
      })
    );

    return issues;
  }

  if (!hasExpectedType(value, entry.type)) {
    issues.push(
      formatIssue({
        level,
        path: entry.path,
        expectedType: entry.type,
        value,
        message: `Invalid type for ${entry.path}. Expected ${entry.type}.`,
      })
    );
  }

  return issues;
}

function checkWildcardPath(document, entry, level) {
  const values = safeGet(document, entry.path, []);
  const issues = [];

  if (!Array.isArray(values) || values.length === 0) {
    if (level === 'error') {
      issues.push(
        formatIssue({
          level,
          path: entry.path,
          expectedType: entry.type,
          value: values,
          message: `Missing required wildcard path: ${entry.path}`,
        })
      );
    } else {
      issues.push(
        formatIssue({
          level,
          path: entry.path,
          expectedType: entry.type,
          value: values,
          message: `Missing optional wildcard path: ${entry.path}`,
        })
      );
    }

    return issues;
  }

  values.forEach((value, index) => {
    if (isMissingValue(value)) {
      issues.push(
        formatIssue({
          level,
          path: `${entry.path}[${index}]`,
          expectedType: entry.type,
          value,
          message: `${level === 'error' ? 'Missing required value' : 'Missing optional value'} at ${entry.path}[${index}]`,
        })
      );

      return;
    }

    if (!hasExpectedType(value, entry.type)) {
      issues.push(
        formatIssue({
          level,
          path: `${entry.path}[${index}]`,
          expectedType: entry.type,
          value,
          message: `Invalid type at ${entry.path}[${index}]. Expected ${entry.type}.`,
        })
      );
    }
  });

  return issues;
}

function checkEntry(document, entry, level) {
  if (entry.path.includes('[]')) {
    return checkWildcardPath(document, entry, level);
  }

  return checkSimplePath(document, entry, level);
}

export function checkDocumentStructure(document, contract = DOCUMENT_CONTRACT) {
  const requiredIssues = contract.required.flatMap((entry) =>
    checkEntry(document, entry, 'error')
  );

  const optionalWarnings = contract.optional.flatMap((entry) =>
    checkEntry(document, entry, 'warning')
  );

  return {
    isValid: requiredIssues.length === 0,
    requiredIssues,
    optionalWarnings,
    allIssues: [...requiredIssues, ...optionalWarnings],
  };
}
