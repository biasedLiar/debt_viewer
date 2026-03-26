import React from 'react';

function MissingField({ required = false, message = 'Not provided' }) {
  return (
    <span
      className={required ? 'missing-field missing-field-required' : 'missing-field'}
      role={required ? 'alert' : undefined}
    >
      {message}
    </span>
  );
}

export default MissingField;
