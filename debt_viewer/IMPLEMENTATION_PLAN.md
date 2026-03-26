# Debt Viewer Implementation Plan

## Goal
Build a React app that renders debtor JSON documents from `src/testData` now, and later supports user-selected JSON files. The expected document shape is defined in `src/testData/debtorDocumentSchema.mjs`.

## Scope
- Read and validate JSON against the expected schema.
- Render document data using reusable components in `src/components`.
- Handle missing fields safely and clearly in the UI.
- Start with local test data, then extend to user-selected files.

## Proposed Folder Structure

```text
src/
  components/
    DocumentViewer/
      DocumentViewer.jsx
    SectionRenderer/
      SectionRenderer.jsx
    FieldRenderer/
      FieldRenderer.jsx
    MissingField/
      MissingField.jsx
    FilePicker/
      FilePicker.jsx
  utils/
    safeGet.js
    normalizeDocument.js
    schemaChecks.js
  testData/
    mock_debtor_document.json
    debtorDocumentSchema.mjs
```

## Step-by-Step Plan

1. Define Data Contract Usage
- Import `debtorDocumentSchema.mjs` in utility code.
- Document required vs optional fields in a simple mapping.
- Decide fallback behavior per field type:
  - string -> "Not provided"
  - number -> "Not provided"
  - array -> empty state message
  - object -> render subsection only if present

2. Create Core Utilities
- `safeGet.js`: Safe nested path reads with default fallback.
- `normalizeDocument.js`: Convert raw JSON into UI-ready shape.
- `schemaChecks.js`: Lightweight checks for required keys and types.
- Return warnings (not hard crashes) for invalid or missing optional data.

3. Build Base Components in `src/components`
- `DocumentViewer`: top-level orchestrator; receives parsed document.
- `SectionRenderer`: renders one logical section (debtor info, balances, etc.).
- `FieldRenderer`: renders one field with label/value and formatting.
- `MissingField`: shared placeholder UI for absent values.
- Keep components small and composable.

4. Implement Missing Field Strategy
- Every field render should go through `FieldRenderer`.
- `FieldRenderer` determines if data exists; if not, shows `MissingField`.
- Optional sections are hidden or shown with "No data" based on UX decision.
- Required missing fields get visual warning style and warning text.

5. Load Test Data First
- Import `mock_debtor_document.json` into app state for initial render.
- Pass data through normalize/check pipeline before display.
- Surface schema warnings in a small diagnostics panel during development.

6. App Integration
- `App.js` owns source-of-truth state:
  - `documentData`
  - `validationWarnings`
  - `loadError`
- Render order:
  - header
  - `FilePicker`
  - error/warning banners
  - `DocumentViewer`

7. Styling and UX
- Ensure placeholders for missing fields are visually consistent.
- Keep section spacing and labels readable on desktop and mobile.
- Use subtle warning indicators rather than blocking user flow.

8. Testing Plan (test data only)
- Unit test `safeGet`, `normalizeDocument`, and schema checks.
- Component tests for:
  - rendering full valid document
  - missing optional fields
  - missing required fields
  - malformed values

9. Add User File Selection
- Build `FilePicker` component using `<input type="file" accept="application/json">`.
- Parse uploaded JSON and run the same normalize/check flow.
- Show user-friendly error messages on invalid JSON or incompatible structure.
- Keep currently loaded valid document if a new upload fails.
- Integration test for file upload success and failure paths.

10. Definition of Done
- App renders mock document from `testData` correctly.
- Missing fields do not crash rendering.
- Required missing fields are clearly identified.
- User can load a JSON file and view/validate it.
- Core utilities and components are covered by tests.

## Implementation Notes
- Prefer defensive rendering over strict assumptions.
- Keep schema interpretation centralized in utilities.
- Avoid schema logic duplication across components.
- Add new sections by composing `SectionRenderer` + `FieldRenderer`.

## Execution Order Summary
1. Utilities
2. Base components
3. App wiring with mock data
4. Missing-field UX polish
5. Styling
6. Tests against test data
7. File upload support
