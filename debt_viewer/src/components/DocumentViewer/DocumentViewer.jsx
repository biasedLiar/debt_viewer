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
    { key: 'kilde', label: 'Kilde', required: true },
    { key: 'dokumenttype', label: 'Dokumenttype', required: true },
    { key: 'uttrekkDato', label: 'Uttrekkdato', required: true },
    { key: 'dokumentDato', label: 'Dokumentdato' },
    { key: 'pdfLenke', label: 'PDF-lenke' },
  ];
}

function createCaseFields() {
  return [
    {
      key: 'rente',
      label: 'Rente',
      getValue: (sak) => sak?.rente,
      formatter: (value) => <strong>{value} %</strong>,
    },
    {
      key: 'saksnummer',
      label: 'Saksnummer',
      required: true,
      getValue: (sak) => sak?.identifikatorer?.Saksnummer,
    },
    {
      key: 'referansenummer',
      label: 'Referansenummer',
      getValue: (sak) => sak?.identifikatorer?.referansenummer,
    },
    {
      key: 'kundenummer',
      label: 'Kundenummer',
      getValue: (sak) => sak?.identifikatorer?.kundenummer,
    },
    {
      key: 'sakInkassoselskap',
      label: 'Inkassoselskap',
      required: true,
      getValue: (sak) => sak?.parter?.inkassoselskap,
    },
    {
      key: 'opprinneligFordringshaver',
      label: 'Opprinnelig fordringshaver',
      getValue: (sak) => sak?.parter?.opprinneligFordringshaver,
    },
    {
      key: 'betalingsfrist',
      label: 'Betalingsfrist',
      getValue: (sak) => sak?.datoer?.betalingsfrist,
    },
    {
      key: 'sakStatus',
      label: 'Saksstatus',
      getValue: (sak) => sak?.detaljer?.sakStatus,
    },
    {
      key: 'mottakerKonto',
      label: 'Mottakerkonto',
      getValue: (sak) => sak?.detaljer?.mottakerKonto,
    },
    {
      key: 'KID',
      label: 'KID',
      getValue: (sak) => sak?.detaljer?.KID,
    },
  ];
}

function createBelopBreakdownFields() {
  return [
    { key: 'restHovedstol', label: 'Rest hovedstol', formatter: formatCurrency },
    { key: 'opprinneligBelop', label: 'Opprinnelig beløp', formatter: formatCurrency },
    { key: 'renter', label: 'Renter', formatter: formatCurrency },
    { key: 'gebyrer', label: 'Gebyrer', formatter: formatCurrency },
    { key: 'inkassosalear', label: 'Inkassosalær', formatter: formatCurrency },
    { key: 'renterAvOmkostninger', label: 'Renter av omkostninger', formatter: formatCurrency },
  ];
}

function createInvoiceFields() {
  return [
    {
      key: 'belop',
      label: 'Beløp',
      formatter: formatCurrencyStrong,
    },
    {
      key: 'fakturanummer',
      label: 'Fakturanummer',
    },
    {
      key: 'fakturadato',
      label: 'Fakturadato',
    },
    {
      key: 'forfallsdato',
      label: 'Forfallsdato',
    },
    {
      key: 'beskrivelse',
      label: 'Beskrivelse',
    },
  ];
}

function createInnbetalingFields() {
  return [
    {
      key: 'belop',
      label: 'Beløp',
      formatter: formatCurrencyStrong,
    },
    {
      key: 'betalingsdato',
      label: 'Betalingsdato',
    },
    {
      key: 'referanse',
      label: 'Referanse',
    },
    {
      key: 'kommentar',
      label: 'Kommentar',
    },
  ];
}

function DocumentViewer({ documentData, warnings = [] }) {
  if (!documentData) {
    return <p>No document loaded.</p>;
  }

  const cases = Array.isArray(documentData.saker) ? documentData.saker : [];
  const title = documentData.inkassoselskap
    || 'Inkassodokument';

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

      <section className="total-amount-strip" aria-label="Totalbeløp">
        <div className="total-amount-block">
          <p className="total-amount-label">Totalbeløp</p>
          <p className="total-amount-value">{formatCurrency(documentData.totalbelop)}</p>
        </div>
        <div className="total-amount-block">
          <p className="total-amount-label">Antall saker</p>
          <p className="total-amount-value">{documentData.antallSaker}</p>
        </div>
      </section>

      <details className="metadata-details">
        <summary className="metadata-details-summary">Document metadata</summary>
        <SectionRenderer
          title=""
          data={documentData.dokumentMetadata}
          fields={createMetadataFields()}
        />
      </details>

      <details className="cases-details" open>
        <summary className="cases-details-summary">Cases</summary>
        <section className="case-list-section">
          {cases.length === 0 ? (
            <p className="no-cases">No cases available.</p>
          ) : (
            cases.map((sak, index) => {
              const saksnummer = sak?.identifikatorer?.Saksnummer;
              const caseTitle = saksnummer
                ? `Sak ${index + 1} — ${saksnummer}`
                : `Sak ${index + 1}`;
              const fakturaer = Array.isArray(sak?.detaljer?.sendteFakturaer)
                ? sak.detaljer.sendteFakturaer
                : [];
              const innbetalinger = Array.isArray(sak?.detaljer?.innbetalinger)
                ? sak.detaljer.innbetalinger
                : [];
              return (
                <div key={saksnummer || `sak-${index}`} className="case-item">
                  <div className="case-card">
                    <h3 className="case-card-title">{caseTitle}</h3>
                    <details className="belop-details">
                      <summary className="belop-details-summary">
                        <span className="belop-summary-label">Totalbeløp</span>
                        <span className="belop-summary-value">{formatCurrencyStrong(sak?.belop?.totalbelop)}</span>
                      </summary>
                      <SectionRenderer
                        title=""
                        data={sak?.belop}
                        fields={createBelopBreakdownFields()}
                        className="belop-breakdown"
                      />
                    </details>
                    <SectionRenderer
                      title=""
                      data={sak}
                      fields={createCaseFields()}
                      className="case-card-section"
                    />
                    {fakturaer.length > 0 && (
                      <details className="invoice-details">
                        <summary className="invoice-details-summary">
                          Fakturaer ({fakturaer.length})
                        </summary>
                        <div className="invoice-list">
                          {fakturaer.map((faktura, fakturaIndex) => (
                            <SectionRenderer
                              key={faktura.fakturanummer || `faktura-${fakturaIndex}`}
                              title={`Faktura ${fakturaIndex + 1}`}
                              data={faktura}
                              fields={createInvoiceFields()}
                              className="invoice-card"
                            />
                          ))}
                        </div>
                      </details>
                    )}
                    {innbetalinger.length > 0 && (
                      <details className="invoice-details">
                        <summary className="invoice-details-summary">
                          Innbetalinger ({innbetalinger.length})
                        </summary>
                        <div className="invoice-list">
                          {innbetalinger.map((innbetaling, innbetalingIndex) => (
                            <SectionRenderer
                              key={innbetaling.referanse || `innbetaling-${innbetalingIndex}`}
                              title={`Innbetaling ${innbetalingIndex + 1}`}
                              data={innbetaling}
                              fields={createInnbetalingFields()}
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
