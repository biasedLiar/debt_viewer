import { useEffect, useRef } from 'react';
import { normalizeDocument } from '../../utils/normalizeDocument';

function formatValidationReason(validation) {
  const requiredIssues = Array.isArray(validation?.requiredIssues)
    ? validation.requiredIssues
    : [];

  if (requiredIssues.length === 0) {
    return 'document is missing required fields or has invalid values.';
  }

  const details = requiredIssues
    .slice(0, 3)
    .map((issue) => issue.path)
    .join(', ');

  const suffix = requiredIssues.length > 3 ? ', ...' : '';
  return `required field issues - ${details}${suffix}`;
}

// Accepts onDocumentLoad(normalizedDocument, warnings) and onError(message).
function FilePicker({ onDocumentLoad, onError, openRequestToken = 0 }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!openRequestToken) {
      return;
    }

    inputRef.current?.click();
  }, [openRequestToken]);

  async function handleFileSelection(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const rawText = await file.text();
      const parsed = JSON.parse(rawText);
      const { normalizedDocument, validation } = normalizeDocument(parsed);

      if (!validation.isValid) {
        onError?.(`Could not load file - ${formatValidationReason(validation)}`);
        return;
      }

      onDocumentLoad?.(normalizedDocument, validation.optionalWarnings);
    } catch (error) {
      const parseMessage = error instanceof Error ? error.message : 'Unknown parse error';
      onError?.(`Could not load file - invalid JSON (${parseMessage}).`);
    } finally {
      event.target.value = '';
    }
  }

  return (
    <input
      ref={inputRef}
      type="file"
      accept="application/json"
      onChange={handleFileSelection}
      style={{ display: 'none' }}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

export default FilePicker;
