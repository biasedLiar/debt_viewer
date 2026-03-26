import React from 'react';

function getDocumentLabel(documentData, fallback) {
  return (
    documentData?.documentMetadata?.source
    || documentData?.debtCollector
    || fallback
  );
}

function Sidebar({ documents, onChooseTestData, onRemoveDocument }) {
  return (
    <aside className="sidebar" aria-label="Document controls">
      <div className="sidebar-section">
        <h2>Documents</h2>
        <div className="sidebar-actions">
          <button type="button" className="sidebar-button" onClick={onChooseTestData}>
            Choose Test Data
          </button>
          <button type="button" className="sidebar-button">
            Upload Real Data
          </button>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Current Documents</h3>
        {documents.length === 0 ? (
          <p className="sidebar-empty">No documents loaded.</p>
        ) : (
          <ul className="sidebar-list">
            {documents.map((doc, index) => (
              <li key={doc.id || `sidebar-doc-${index}`}>
                <button
                  type="button"
                  className="sidebar-item"
                  onClick={() => onRemoveDocument?.(doc.id)}
                  aria-label={`Remove ${getDocumentLabel(doc.data, `Document ${index + 1}`)}`}
                >
                  <span className="sidebar-item-title">
                    {getDocumentLabel(doc.data, `Document ${index + 1}`)}
                  </span>
                  <span className="sidebar-item-action">Remove</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
