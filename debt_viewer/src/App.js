import { useRef, useState } from 'react';
import './App.css';
import DocumentViewer from './components/DocumentViewer/DocumentViewer';
import FilePicker from './components/FilePicker/FilePicker';
import Sidebar from './components/Sidebar/Sidebar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { normalizeDocument } from './utils/normalizeDocument';
import mockDocument from './testData/mock_debtor_document.json';
import mockDocument1Case from './testData/mock_debtor_document_1case_10invoices.json';
import mockDocument6Cases from './testData/mock_debtor_document_6cases.json';

ChartJS.register(ArcElement, Tooltip, Legend);

const TEST_DOCUMENTS = [
  {
    id: 'mock_debtor_document',
    label: 'Mock document (2 cases)',
    result: normalizeDocument(mockDocument),
  },
  {
    id: 'mock_debtor_document_1case_10invoices',
    label: 'Mock document (1 case, 10 invoices)',
    result: normalizeDocument(mockDocument1Case),
  },
  {
    id: 'mock_debtor_document_6cases',
    label: 'Mock document (6 cases)',
    result: normalizeDocument(mockDocument6Cases),
  },
];

const initialDocuments = [
  {
    id: TEST_DOCUMENTS[0].id,
    data: TEST_DOCUMENTS[0].result.normalizedDocument,
    warnings: TEST_DOCUMENTS[0].result.validation.optionalWarnings,
  },
];

function createDocumentId(prefix = 'doc') {
  const randomPart = Math.random().toString(16).slice(2, 8);
  return `${prefix}-${Date.now()}-${randomPart}`;
}

function App() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [loadError, setLoadError] = useState(null);
  const [isTestPickerOpen, setIsTestPickerOpen] = useState(false);
  const colorRegistryRef = useRef(new Map());

  const isDev = process.env.NODE_ENV === 'development';

  const documentCount = documents.length;
  const grandTotal = documents.reduce(
    (sum, doc) => sum + (Number.isFinite(doc.data?.totalAmount) ? doc.data.totalAmount : 0),
    0
  );

  const grandTotalFormatter = new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK',
    minimumFractionDigits: 2,
  });

  const chartDocuments = [...documents].reverse();

  const rawChartLabels = chartDocuments.map((doc, index) => (
    doc.data?.documentMetadata?.source
    || doc.data?.debtCollector
    || `Document ${index + 1}`
  ));

  const labelCounts = rawChartLabels.reduce((acc, label) => {
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const labelOccurrences = {};
  const chartLabels = rawChartLabels.map((label) => {
    if (labelCounts[label] <= 1) {
      return label;
    }

    labelOccurrences[label] = (labelOccurrences[label] || 0) + 1;
    return `${label} (#${labelOccurrences[label]})`;
  });

  const chartValues = chartDocuments.map((doc) => (
    Number.isFinite(doc.data?.totalAmount) ? doc.data.totalAmount : 0
  ));

  const chartColors = [
    '#1e88e5',
    '#43a047',
    '#fb8c00',
    '#8e24aa',
    '#00acc1',
    '#6d4c41',
  ];

  function pickNextColor(usedColors, fallbackIndex) {
    const available = chartColors.filter((color) => !usedColors.has(color));

    if (available.length > 0) {
      return available[0];
    }

    const hue = (fallbackIndex * 47) % 360;
    return `hsl(${hue} 65% 45%)`;
  }

  function getColorForDocument(doc, index) {
    const key = doc.id || doc.data?.documentMetadata?.source || doc.data?.debtCollector || index;
    const registry = colorRegistryRef.current;

    if (registry.has(key)) {
      return registry.get(key);
    }

    const usedColors = new Set(registry.values());
    const color = pickNextColor(usedColors, index);
    registry.set(key, color);
    return color;
  }

  const chartBackgrounds = chartDocuments.map((doc, index) => getColorForDocument(doc, index));

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues,
        backgroundColor: chartBackgrounds,
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    rotation: 0,
    cutout: '60%',
    animation: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          color: '#546e7a',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed || 0;
            return `${context.label}: ${grandTotalFormatter.format(value)}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  const availableTestDocuments = TEST_DOCUMENTS.filter(
    (doc) => !documents.some((existing) => existing.id === doc.id)
  );

  function handleDocumentLoad(normalizedDocument, warnings) {
    setDocuments((prev) => [
      ...prev,
      {
        id: createDocumentId('upload'),
        data: normalizedDocument,
        warnings,
      },
    ]);
    setLoadError(null);
  }

  function handleLoadError(message) {
    setLoadError(message);
  }

  function handleOpenTestPicker() {
    setIsTestPickerOpen(true);
  }

  function handleCloseTestPicker() {
    setIsTestPickerOpen(false);
  }

  function handleAddTestDocument(docId) {
    const selected = TEST_DOCUMENTS.find((doc) => doc.id === docId);

    if (!selected) {
      return;
    }

    setDocuments((prev) => [
      ...prev,
      {
        id: selected.id,
        data: selected.result.normalizedDocument,
        warnings: selected.result.validation.optionalWarnings,
      },
    ]);
    setIsTestPickerOpen(false);
  }

  function handleRemoveDocument(docId) {
    setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Debt Viewer</h1>
      </header>

      <main className="app-layout">
        <Sidebar
          documents={documents}
          onChooseTestData={handleOpenTestPicker}
          onRemoveDocument={handleRemoveDocument}
        />
        <section className="app-content">
          <FilePicker
            onDocumentLoad={handleDocumentLoad}
            onError={handleLoadError}
          />

          {loadError && (
            <p className="load-error" role="alert">
              {loadError}
            </p>
          )}

          <div className="document-list">
            {documentCount > 1 && (
              <article className="document-tile document-summary-tile">
                <header className="document-tile-header">
                  <h2 className="document-tile-title">Grand Total</h2>
                </header>
                <section className="grand-total-layout" aria-label="Grand total">
                  <div className="grand-total-chart" aria-label="Totals by document">
                    <Doughnut data={chartData} options={chartOptions} />
                  </div>
                  <div className="grand-total-metrics">
                    <div className="total-amount-block">
                      <p className="total-amount-label">Grand Total Amount</p>
                      <p className="total-amount-value">
                        {grandTotalFormatter.format(grandTotal)}
                      </p>
                    </div>
                    <div className="total-amount-block">
                      <p className="total-amount-label">Number of Debtors</p>
                      <p className="total-amount-value">{documentCount}</p>
                    </div>
                  </div>
                </section>
              </article>
            )}
            {documents.map((doc, index) => (
              <DocumentViewer
                key={doc.id || `doc-${index}`}
                documentData={doc.data}
                warnings={isDev ? doc.warnings : []}
              />
            ))}
          </div>
        </section>
      </main>

      {isTestPickerOpen && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="test-data-title">
            <div className="modal-header">
              <h2 id="test-data-title">Choose test data</h2>
              <button type="button" className="modal-close" onClick={handleCloseTestPicker}>
                Close
              </button>
            </div>
            {availableTestDocuments.length === 0 ? (
              <p className="modal-empty">All test documents are already loaded.</p>
            ) : (
              <ul className="modal-list">
                {availableTestDocuments.map((doc) => (
                  <li key={doc.id}>
                    <button
                      type="button"
                      className="modal-button"
                      onClick={() => handleAddTestDocument(doc.id)}
                    >
                      {doc.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
