import React from 'react';
import FieldRenderer from '../FieldRenderer/FieldRenderer';

function SectionRenderer({
  title,
  fields = [],
  data,
  className = '',
  emptyMessage = 'No data available',
  hideWhenEmpty = false,
}) {
  const hasRenderableFields = fields.some((field) => field.shouldRender !== false);

  // When the entire data object is absent, honour the hideWhenEmpty contract.
  const dataMissing = data === null || data === undefined;

  if (!hasRenderableFields || dataMissing) {
    if (hideWhenEmpty) {
      return null;
    }

    return (
      <section className={`section-renderer ${className}`.trim()}>
        <h3>{title}</h3>
        <p className="missing-field">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className={`section-renderer ${className}`.trim()}>
      {title ? <h3>{title}</h3> : null}
      <dl>
        {fields
          .filter((field) => field.shouldRender !== false)
          .map((field) => {
            const rawValue =
              typeof field.getValue === 'function'
                ? field.getValue(data)
                : data?.[field.key];

            return (
              <FieldRenderer
                key={`${title}-${field.key}`}
                label={field.label}
                value={rawValue}
                required={Boolean(field.required)}
                formatter={field.formatter}
                missingMessage={field.missingMessage}
              />
            );
          })}
      </dl>
    </section>
  );
}

export default SectionRenderer;
