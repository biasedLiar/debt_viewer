import React from 'react';
import MissingField from '../MissingField/MissingField';
import { isMissingValue } from '../../utils/safeGet';

function defaultFormat(value) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }

  return String(value);
}

function FieldRenderer({
  label,
  value,
  required = false,
  formatter = defaultFormat,
  missingMessage = 'Not provided',
}) {
  const missing = isMissingValue(value);

  return (
    <div className="field-row">
      <dt className={required ? 'field-label field-label-required' : 'field-label'}>{label}</dt>
      <dd className="field-value">
        {missing ? (
          <MissingField required={required} message={missingMessage} />
        ) : (
          formatter(value)
        )}
      </dd>
    </div>
  );
}

export default FieldRenderer;
