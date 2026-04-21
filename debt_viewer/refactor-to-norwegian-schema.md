# Refactor to Norwegian Schema

This document outlines every change required to migrate the app from the English-key schema (`debtorDocumentSchema.mjs`) to the Norwegian-key schema (`debtorDocumentSchemaNorsk.mjs`) and the corresponding Norwegian sample data.

---

## Field Name Mapping

### Top-level document (`DebtCollectionDocument` → `Inkassodokument`)

| Old (English) | New (Norwegian) |
|---|---|
| `documentMetadata` | `dokumentMetadata` |
| `documentMetadata.source` | `dokumentMetadata.kilde` |
| `documentMetadata.documentType` | `dokumentMetadata.dokumenttype` |
| `documentMetadata.extractionDate` | `dokumentMetadata.uttrekkDato` |
| `documentMetadata.pdfPath` | *(removed — no equivalent)* |
| `documentMetadata.pdfLink` | `dokumentMetadata.pdfLenke` |
| `documentMetadata.documentDate` | `dokumentMetadata.dokumentDato` |
| `totalAmount` | `totalbelop` |
| `numberOfCases` | `antallSaker` |
| `debtCollector` | `inkassoselskap` |
| `cases` | `saker` |

### Per-case (`DebtCase` → `Gjeldssak`)

| Old (English) | New (Norwegian) |
|---|---|
| `identifiers` | `identifikatorer` |
| `identifiers.caseNumber` | `identifikatorer.Saksnummer` |
| `identifiers.referenceNumber` | `identifikatorer.referansenummer` |
| `identifiers.customerNumber` | `identifikatorer.kundenummer` |
| `amounts` | `belop` |
| `amounts.totalAmount` | `belop.totalbelop` |
| `amounts.principalAmount` | `belop.restHovedstol` |
| *(new)* | `belop.opprinneligBelop` |
| `amounts.interest` | `belop.renter` |
| `amounts.fees` | `belop.gebyrer` |
| `amounts.collectionFees` | `belop.inkassosalear` |
| `amounts.interestOnCosts` | `belop.renterAvOmkostninger` |
| *(new top-level case field)* | `rente` |
| `dates` | `datoer` |
| `dates.invoiceDate` | `datoer.fakturadato` |
| `dates.originalDueDate` | `datoer.opprinneligForfallsdato` |
| `dates.issuedDate` | `datoer.utstedtDato` |
| `dates.paymentDeadline` | `datoer.betalingsfrist` |
| `parties` | `parter` |
| `parties.debtCollector` | `parter.inkassoselskap` |
| `parties.currentCreditor` | `parter.Fordringshaver` |
| `parties.originalCreditor` | `parter.opprinneligFordringshaver` |
| `parties.debtor` | `parter.skyldner` |
| `parties.debtor.name` | `parter.skyldner.navn` |
| `parties.debtor.nationalId` | `parter.skyldner.fodselsnummer` |
| *(new)* | `parter.skyldner.telefonnummer` |
| *(new)* | `parter.skyldner.epostadresse` |
| `parties.debtor.address` | `parter.skyldner.adresse` |
| `parties.debtor.address.street` | `parter.skyldner.adresse.gateadresse` |
| `parties.debtor.address.postalCode` | `parter.skyldner.adresse.postnummer` |
| `parties.debtor.address.city` | `parter.skyldner.adresse.poststed` |
| `parties.debtor.address.country` | `parter.skyldner.adresse.land` |
| `details` | `detaljer` |
| `details.caseStatus` | `detaljer.sakStatus` |
| `details.description` | `detaljer.beskrivelse` |
| `details.basisForClaim` | `detaljer.grunnlagForKrav` |
| `details.invoices` | `detaljer.sendteFakturaer` |
| `details.claimType` | `detaljer.kravtype` |
| `details.notes` | `detaljer.notater` |
| *(new)* | `detaljer.innbetalinger` |

### Per-invoice (`Invoice` → `Faktura`, inside `detaljer.sendteFakturaer`)

| Old (English) | New (Norwegian) |
|---|---|
| `invoiceNumber` | `fakturanummer` |
| `invoiceDate` | `fakturadato` |
| `dueDate` | `forfallsdato` |
| `amount` | `belop` |
| `description` | `beskrivelse` |

### Payments (new: `Innbetaling`, inside `detaljer.innbetalinger`)

| Field | Type | Notes |
|---|---|---|
| `betalingsdato` | string | Payment date (DD.MM.YYYY) |
| `belop` | number | Amount paid |
| `referanse` | string | Payment reference |
| `kommentar` | string | Optional comment |

---

## Files to Change

### 1. `src/utils/documentContract.js`

- Change the schema import from `debtorDocumentSchema.mjs` to `debtorDocumentSchemaNorsk.mjs`.
- Rewrite the entire `DOCUMENT_CONTRACT` object using Norwegian field paths, following the mapping table above.

**Required fields (new paths):**
```js
{ path: 'dokumentMetadata.kilde', type: FIELD_TYPES.STRING },
{ path: 'dokumentMetadata.dokumenttype', type: FIELD_TYPES.STRING },
{ path: 'dokumentMetadata.uttrekkDato', type: FIELD_TYPES.STRING },
{ path: 'totalbelop', type: FIELD_TYPES.NUMBER },
{ path: 'antallSaker', type: FIELD_TYPES.NUMBER },
{ path: 'inkassoselskap', type: FIELD_TYPES.STRING },
{ path: 'saker', type: FIELD_TYPES.ARRAY },
{ path: 'saker[].identifikatorer.Saksnummer', type: FIELD_TYPES.STRING },
{ path: 'saker[].belop.totalbelop', type: FIELD_TYPES.NUMBER },
{ path: 'saker[].belop.restHovedstol', type: FIELD_TYPES.NUMBER },
{ path: 'saker[].parter.inkassoselskap', type: FIELD_TYPES.STRING },
```

**Optional fields (new paths):**
```js
{ path: 'dokumentMetadata.pdfLenke', type: FIELD_TYPES.STRING },
{ path: 'dokumentMetadata.dokumentDato', type: FIELD_TYPES.STRING },
{ path: 'saker[].identifikatorer.referansenummer', type: FIELD_TYPES.STRING },
{ path: 'saker[].identifikatorer.kundenummer', type: FIELD_TYPES.STRING },
{ path: 'saker[].rente', type: FIELD_TYPES.NUMBER },
{ path: 'saker[].belop.opprinneligBelop', type: FIELD_TYPES.NUMBER },
{ path: 'saker[].belop.renter', type: FIELD_TYPES.NUMBER },
{ path: 'saker[].belop.gebyrer', type: FIELD_TYPES.NUMBER },
{ path: 'saker[].belop.inkassosalear', type: FIELD_TYPES.NUMBER },
{ path: 'saker[].belop.renterAvOmkostninger', type: FIELD_TYPES.NUMBER },
{ path: 'saker[].datoer.fakturadato', type: FIELD_TYPES.STRING },
{ path: 'saker[].datoer.opprinneligForfallsdato', type: FIELD_TYPES.STRING },
{ path: 'saker[].datoer.utstedtDato', type: FIELD_TYPES.STRING },
{ path: 'saker[].datoer.betalingsfrist', type: FIELD_TYPES.STRING },
{ path: 'saker[].parter.Fordringshaver', type: FIELD_TYPES.STRING },
{ path: 'saker[].parter.opprinneligFordringshaver', type: FIELD_TYPES.STRING },
{ path: 'saker[].parter.skyldner', type: FIELD_TYPES.OBJECT },
{ path: 'saker[].parter.skyldner.navn', type: FIELD_TYPES.STRING },
{ path: 'saker[].parter.skyldner.fodselsnummer', type: FIELD_TYPES.STRING },
{ path: 'saker[].parter.skyldner.telefonnummer', type: FIELD_TYPES.STRING },
{ path: 'saker[].parter.skyldner.epostadresse', type: FIELD_TYPES.STRING },
{ path: 'saker[].parter.skyldner.adresse', type: FIELD_TYPES.OBJECT },
{ path: 'saker[].parter.skyldner.adresse.gateadresse', type: FIELD_TYPES.STRING },
{ path: 'saker[].parter.skyldner.adresse.postnummer', type: FIELD_TYPES.STRING },
{ path: 'saker[].parter.skyldner.adresse.poststed', type: FIELD_TYPES.STRING },
{ path: 'saker[].parter.skyldner.adresse.land', type: FIELD_TYPES.STRING },
{ path: 'saker[].detaljer', type: FIELD_TYPES.OBJECT },
{ path: 'saker[].detaljer.sakStatus', type: FIELD_TYPES.STRING },
{ path: 'saker[].detaljer.beskrivelse', type: FIELD_TYPES.STRING },
{ path: 'saker[].detaljer.grunnlagForKrav', type: FIELD_TYPES.STRING },
{ path: 'saker[].detaljer.sendteFakturaer', type: FIELD_TYPES.ARRAY },
{ path: 'saker[].detaljer.sendteFakturaer[].fakturanummer', type: FIELD_TYPES.STRING },
{ path: 'saker[].detaljer.sendteFakturaer[].fakturadato', type: FIELD_TYPES.STRING },
{ path: 'saker[].detaljer.sendteFakturaer[].forfallsdato', type: FIELD_TYPES.STRING },
{ path: 'saker[].detaljer.sendteFakturaer[].belop', type: FIELD_TYPES.NUMBER },
{ path: 'saker[].detaljer.sendteFakturaer[].beskrivelse', type: FIELD_TYPES.STRING },
{ path: 'saker[].detaljer.innbetalinger', type: FIELD_TYPES.ARRAY },
{ path: 'saker[].detaljer.innbetalinger[].betalingsdato', type: FIELD_TYPES.STRING },
{ path: 'saker[].detaljer.innbetalinger[].belop', type: FIELD_TYPES.NUMBER },
{ path: 'saker[].detaljer.innbetalinger[].referanse', type: FIELD_TYPES.STRING },
{ path: 'saker[].detaljer.innbetalinger[].kommentar', type: FIELD_TYPES.STRING },
{ path: 'saker[].detaljer.kravtype', type: FIELD_TYPES.STRING },
{ path: 'saker[].detaljer.notater', type: FIELD_TYPES.STRING },
```

---

### 2. `src/components/DocumentViewer/DocumentViewer.jsx`

#### `createMetadataFields()`

Replace all English keys and labels with Norwegian equivalents. Remove the `pdfPath` entry (no Norwegian equivalent):

```js
{ key: 'kilde', label: 'Kilde', required: true },
{ key: 'dokumenttype', label: 'Dokumenttype', required: true },
{ key: 'uttrekkDato', label: 'Uttrekkdato', required: true },
{ key: 'dokumentDato', label: 'Dokumentdato' },
{ key: 'pdfLenke', label: 'PDF-lenke' },
```

#### `createCaseFields()`

Update all `getValue` accessors to use Norwegian field paths:

```js
{ key: 'sakTotalbelop', label: 'Sak totalbeløp', required: true,
  getValue: (sak) => sak?.belop?.totalbelop, formatter: formatCurrencyStrong },
{ key: 'saksnummer', label: 'Saksnummer', required: true,
  getValue: (sak) => sak?.identifikatorer?.Saksnummer },
{ key: 'referansenummer', label: 'Referansenummer',
  getValue: (sak) => sak?.identifikatorer?.referansenummer },
{ key: 'kundenummer', label: 'Kundenummer',
  getValue: (sak) => sak?.identifikatorer?.kundenummer },
{ key: 'sakInkassoselskap', label: 'Inkassoselskap', required: true,
  getValue: (sak) => sak?.parter?.inkassoselskap },
{ key: 'opprinneligFordringshaver', label: 'Opprinnelig fordringshaver',
  getValue: (sak) => sak?.parter?.opprinneligFordringshaver },
{ key: 'restHovedstol', label: 'Rest hovedstol', required: true,
  getValue: (sak) => sak?.belop?.restHovedstol, formatter: formatCurrency },
{ key: 'betalingsfrist', label: 'Betalingsfrist',
  getValue: (sak) => sak?.datoer?.betalingsfrist },
{ key: 'sakStatus', label: 'Saksstatus',
  getValue: (sak) => sak?.detaljer?.sakStatus },
```

#### `createInvoiceFields()`

Update keys to match Norwegian invoice field names:

```js
{ key: 'belop', label: 'Beløp', formatter: formatCurrencyStrong },
{ key: 'fakturanummer', label: 'Fakturanummer' },
{ key: 'fakturadato', label: 'Fakturadato' },
{ key: 'forfallsdato', label: 'Forfallsdato' },
{ key: 'beskrivelse', label: 'Beskrivelse' },
```

#### Main component render

Update all references to top-level and per-case Norwegian field names:

- `documentData.cases` → `documentData.saker`
- `documentData.debtCollector` → `documentData.inkassoselskap`
- `documentData.totalAmount` → `documentData.totalbelop`
- `documentData.numberOfCases` → `documentData.antallSaker`
- `debtCase?.identifiers?.caseNumber` → `sak?.identifikatorer?.Saksnummer`
- `debtCase?.details?.invoices` → `sak?.detaljer?.sendteFakturaer`

Labels in the total strip:
- `"Total Amount"` → `"Totalbeløp"`
- `"Number of Cases"` → `"Antall saker"`

---

### 3. `src/App.js`

#### Test data imports

Replace English mock imports with Norwegian equivalents:

```js
// Remove:
import mockDocument from './testData/mock_debtor_document.json';
import mockDocument1Case from './testData/mock_debtor_document_1case_10invoices.json';
import mockDocument6Cases from './testData/mock_debtor_document_6cases.json';

// Add:
import mockDocument from './testData/norsk/mock_debtor_document_norsk.json';
import mockDocument1Case from './testData/norsk/mock_debtor_document_1case_10invoices_norsk.json';
import mockDocument6Cases from './testData/norsk/mock_debtor_document_6cases_norsk.json';
```

#### `getCreditorKey()`

```js
// Old:
return documentData?.debtCollector || documentData?.documentMetadata?.source || '';
// New:
return documentData?.inkassoselskap || documentData?.dokumentMetadata?.kilde || '';
```

#### `grandTotal` calculation

```js
// Old:
(sum, doc) => sum + (Number.isFinite(doc.data?.totalAmount) ? doc.data.totalAmount : 0)
// New:
(sum, doc) => sum + (Number.isFinite(doc.data?.totalbelop) ? doc.data.totalbelop : 0)
```

#### Chart labels

```js
// Old:
doc.data?.documentMetadata?.source || doc.data?.debtCollector || `Document ${index + 1}`
// New:
doc.data?.dokumentMetadata?.kilde || doc.data?.inkassoselskap || `Dokument ${index + 1}`
```

#### Chart values

```js
// Old:
Number.isFinite(doc.data?.totalAmount) ? doc.data.totalAmount : 0
// New:
Number.isFinite(doc.data?.totalbelop) ? doc.data.totalbelop : 0
```

---

### 4. `src/components/Sidebar/Sidebar.jsx`

#### `getDocumentLabel()`

```js
// Old:
return (
  documentData?.documentMetadata?.source
  || documentData?.debtCollector
  || fallback
);
// New:
return (
  documentData?.dokumentMetadata?.kilde
  || documentData?.inkassoselskap
  || fallback
);
```

---

### 5. `src/utils/normalizeDocument.test.js`

- Replace the mock import:
  ```js
  // Old:
  import mockDocument from '../testData/mock_debtor_document.json';
  // New:
  import mockDocument from '../testData/norsk/mock_debtor_document_norsk.json';
  ```
- Update field path in the "fills missing optional nested string fields" test:
  ```js
  // Old:
  delete doc.cases[0].parties.debtor.address.city;
  expect(result.normalizedDocument.cases[0].parties.debtor.address.city).toBe('Not provided');
  // New:
  delete doc.saker[0].parter.skyldner.adresse.poststed;
  expect(result.normalizedDocument.saker[0].parter.skyldner.adresse.poststed).toBe('Not provided');
  ```
- Update the "handles non-object input" assertions:
  ```js
  // Old:
  expect(result.normalizedDocument.documentMetadata).toBeDefined();
  expect(result.normalizedDocument.cases).toEqual([]);
  expect(result.normalizedDocument.totalAmount).toBe('Not provided');
  // New:
  expect(result.normalizedDocument.dokumentMetadata).toBeDefined();
  expect(result.normalizedDocument.saker).toEqual([]);
  expect(result.normalizedDocument.totalbelop).toBe('Not provided');
  ```

---

### 6. `src/utils/schemaChecks.test.js`

- Replace the mock import:
  ```js
  // Old:
  import mockDocument from '../testData/mock_debtor_document.json';
  // New:
  import mockDocument from '../testData/norsk/mock_debtor_document_norsk.json';
  ```
- Update field path in "reports missing required field" test:
  ```js
  // Old:
  delete broken.numberOfCases;
  expect(result.requiredIssues.some((issue) => issue.path === 'numberOfCases')).toBe(true);
  // New:
  delete broken.antallSaker;
  expect(result.requiredIssues.some((issue) => issue.path === 'antallSaker')).toBe(true);
  ```
- Update field path in "reports malformed required value type" test:
  ```js
  // Old:
  malformed.numberOfCases = 'two';
  expect(result.requiredIssues.some((issue) => issue.path === 'numberOfCases')).toBe(true);
  // New:
  malformed.antallSaker = 'two';
  expect(result.requiredIssues.some((issue) => issue.path === 'antallSaker')).toBe(true);
  ```

---

## Files NOT Changed

| File | Reason |
|---|---|
| `src/utils/safeGet.js` | Path-resolution logic is schema-agnostic |
| `src/utils/normalizeDocument.js` | Contract-driven; uses the contract object, not hardcoded paths |
| `src/utils/schemaChecks.js` | Contract-driven; uses the contract object, not hardcoded paths |
| `src/components/SectionRenderer/SectionRenderer.jsx` | Purely structural; field definitions are passed in as props |
| `src/components/FieldRenderer/FieldRenderer.jsx` | Purely structural; renders whatever label/value it receives |
| `src/components/FilePicker/FilePicker.jsx` | Schema-agnostic file upload UI |
| `src/components/MissingField/MissingField.jsx` | Display-only component |

---

## Norwegian Sample Data Files (already present)

| New import target | Label |
|---|---|
| `testData/norsk/mock_debtor_document_norsk.json` | Mock document (2 cases) |
| `testData/norsk/mock_debtor_document_1case_10invoices_norsk.json` | Mock document (1 case, 10 invoices) |
| `testData/norsk/mock_debtor_document_6cases_norsk.json` | Mock document (6 cases) |
| `testData/norsk/mock_debtor_document_3cases_norsk.json` | Mock document (3 cases) — available but not in TEST_DOCUMENTS; add if desired |
| `testData/norsk/mock_debtor_document_invalid_missing_field_type_error_norsk.json` | Invalid document for error-path testing |
