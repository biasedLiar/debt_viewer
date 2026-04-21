import React from 'react';

function getDocumentLabel(documentData, fallback) {
  return (
    documentData?.dokumentMetadata?.kilde
    || documentData?.inkassoselskap
    || fallback
  );
}

function Sidebar({ documents, onChooseTestData, onUploadRealData, onRemoveDocument }) {
  return (
    <aside className="sidebar" aria-label="Document controls">
      <div className="sidebar-section">
        <h2>Dokumenter</h2>
        <div className="sidebar-actions">
          <button type="button" className="sidebar-button" onClick={onChooseTestData}>
            Velg testdata
          </button>
          <button type="button" className="sidebar-button" onClick={onUploadRealData}>
            Last opp data
          </button>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Åpne dokumenter</h3>
        {documents.length === 0 ? (
          <p className="sidebar-empty">Ingen dokumenter lastet.</p>
        ) : (
          <ul className="sidebar-list">
            {documents.map((doc, index) => (
              <li key={doc.id || `sidebar-doc-${index}`}>
                <button
                  type="button"
                  className="sidebar-item"
                  onClick={() => onRemoveDocument?.(doc.id)}
                  aria-label={`Fjern ${getDocumentLabel(doc.data, `Dokument ${index + 1}`)}`}
                >
                  <span className="sidebar-item-title">
                    {getDocumentLabel(doc.data, `Dokument ${index + 1}`)}
                  </span>
                  <span className="sidebar-item-action">Fjern</span>
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
