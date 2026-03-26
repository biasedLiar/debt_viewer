function isObjectLike(value) {
  return value !== null && typeof value === 'object';
}

function isArrayToken(token) {
  return token.endsWith('[]');
}

function tokenKey(token) {
  return isArrayToken(token) ? token.slice(0, -2) : token;
}

export function tokenizePath(path) {
  if (typeof path !== 'string' || path.trim() === '') {
    return [];
  }

  return path.split('.').filter(Boolean);
}

function resolvePathValues(currentValue, tokens, index) {
  if (index >= tokens.length) {
    return [currentValue];
  }

  const token = tokens[index];
  const key = tokenKey(token);

  if (!isObjectLike(currentValue)) {
    return [];
  }

  if (isArrayToken(token)) {
    const nextArray = currentValue[key];

    if (!Array.isArray(nextArray)) {
      return [];
    }

    return nextArray.flatMap((item) => resolvePathValues(item, tokens, index + 1));
  }

  if (!Object.prototype.hasOwnProperty.call(currentValue, key)) {
    return [];
  }

  return resolvePathValues(currentValue[key], tokens, index + 1);
}

export function safeGet(source, path, defaultValue = undefined) {
  const tokens = tokenizePath(path);

  if (tokens.length === 0) {
    return source;
  }

  const values = resolvePathValues(source, tokens, 0);

  if (values.length === 0) {
    return defaultValue;
  }

  return path.includes('[]') ? values : values[0];
}

export function isMissingValue(value) {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim() === '';
  }

  if (typeof value === 'number') {
    return Number.isNaN(value);
  }

  return false;
}

export function hasExpectedType(value, expectedType) {
  if (isMissingValue(value)) {
    return false;
  }

  if (expectedType === 'string') {
    return typeof value === 'string' && value.trim() !== '';
  }

  if (expectedType === 'number') {
    return typeof value === 'number' && Number.isFinite(value);
  }

  if (expectedType === 'array') {
    return Array.isArray(value);
  }

  if (expectedType === 'object') {
    return isObjectLike(value) && !Array.isArray(value);
  }

  return true;
}
