import React from 'react';
import SectionRenderer from '../SectionRenderer/SectionRenderer';

const currencyFormatter = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
  minimumFractionDigits: 2,
});

function formatCurrency(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return String(value);
  }
  return currencyFormatter.format(value);
}

function formatCurrencyStrong(value) {
  return <strong>{formatCurrency(value)}</strong>;
}

function createMetadataFields() {
  return [
    { key: 'source', label: 'Source', required: true },
    { key: 'documentType', label: 'Document Type', required: true },
    { key: 'extractionDate', label: 'Extraction Date', required: true },
    { key: 'documentDate', label: 'Document Date' },
    { key: 'pdfPath', label: 'PDF Path' },
    { key: 'pdfLink', label: 'PDF Link' },
  ];
}

function createCaseFields() {
  return [
    {
      key: 'caseTotalAmount',
      label: 'Case Total Amount',
      required: true,
      getValue: (debtCase) => debtCase?.amounts?.totalAmount,
      formatter: formatCurrencyStrong,
    },
    {
      key: 'caseNumber',
      label: 'Case Number',
      required: true,
      getValue: (debtCase) => debtCase?.identifiers?.caseNumber,
    },
    {
      key: 'referenceNumber',
      label: 'Reference Number',
      getValue: (debtCase) => debtCase?.identifiers?.referenceNumber,
    },
    {
      key: 'customerNumber',
      label: 'Customer Number',
      getValue: (debtCase) => debtCase?.identifiers?.customerNumber,
    },
    {
      key: 'caseCollector',
      label: 'Case Debt Collector',
      required: true,
      getValue: (debtCase) => debtCase?.parties?.debtCollector,
    },
    {
      key: 'principalAmount',
      label: 'Principal Amount',
      required: true,
      getValue: (debtCase) => debtCase?.amounts?.principalAmount,
      formatter: formatCurrency,
    },
    {
      key: 'paymentDeadline',
      label: 'Payment Deadline',
      getValue: (debtCase) => debtCase?.dates?.paymentDeadline,
    },
    {
      key: 'caseStatus',
      label: 'Case Status',
      getValue: (debtCase) => debtCase?.details?.caseStatus,
    },
  ];
}

function createInvoiceFields() {
  return [
    {
      key: 'amount',
      label: 'Amount',
      formatter: formatCurrencyStrong,
    },
    {
      key: 'invoiceNumber',
      label: 'Invoice Number',
    },
    {
      key: 'invoiceDate',
      label: 'Invoice Date',
    },
    {
      key: 'dueDate',
      label: 'Due Date',
    },
    {
      key: 'description',
      label: 'Description',
    },
  ];
}

function DocumentViewer({ documentData, warnings = [] }) {
  if (!documentData) {
    return <p>No document loaded.</p>;
  }

  const cases = Array.isArray(documentData.cases) ? documentData.cases : [];
  const title = documentData.debtCollector
    || 'Debt Collection Document';

  return (
    <article className="document-tile">
      <header className="document-tile-header">
        <h2 className="document-tile-title">{title}</h2>
      </header>

      {warnings.length > 0 && (
        <section className="document-warnings" aria-live="polite">
          <h3>Schema Warnings</h3>
          <ul>
            {warnings.map((warning, index) => (
              <li key={`${warning.path}-${index}`}>{warning.message}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="total-amount-strip" aria-label="Total amount">
        <div className="total-amount-block">
          <p className="total-amount-label">Total Amount</p>
          <p className="total-amount-value">{formatCurrency(documentData.totalAmount)}</p>
        </div>
        <div className="total-amount-block">
          <p className="total-amount-label">Number of Cases</p>
          <p className="total-amount-value">{documentData.numberOfCases}</p>
        </div>
      </section>

      <details className="metadata-details">
        <summary className="metadata-details-summary">Document metadata</summary>
        <SectionRenderer
          title=""
          data={documentData.documentMetadata}
          fields={createMetadataFields()}
        />
      </details>

      <details className="cases-details" open>
        <summary className="cases-details-summary">Cases</summary>
        <section className="case-list-section">
          {cases.length === 0 ? (
            <p className="no-cases">No cases available.</p>
          ) : (
            cases.map((debtCase, index) => {
              const caseNumber = debtCase?.identifiers?.caseNumber;
              const caseTitle = caseNumber
                ? `Case ${index + 1} — ${caseNumber}`
                : `Case ${index + 1}`;
              const invoices = Array.isArray(debtCase?.details?.invoices)
                ? debtCase.details.invoices
                : [];
              return (
                <div key={caseNumber || `case-${index}`} className="case-item">
                  <div className="case-card">
                    <SectionRenderer
                      title={caseTitle}
                      data={debtCase}
                      fields={createCaseFields()}
                      className="case-card-section"
                    />
                    {invoices.length > 0 && (
                      <details className="invoice-details">
                        <summary className="invoice-details-summary">
                          Invoices ({invoices.length})
                        </summary>
                        <div className="invoice-list">
                          {invoices.map((invoice, invoiceIndex) => (
                            <SectionRenderer
                              key={invoice.invoiceNumber || `invoice-${invoiceIndex}`}
                              title={`Invoice ${invoiceIndex + 1}`}
                              data={invoice}
                              fields={createInvoiceFields()}
                              className="invoice-card"
                            />
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>
      </details>
    </article>
  );
}

export default DocumentViewer;
