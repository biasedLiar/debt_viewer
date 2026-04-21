# Gjeldsvisning

En React-applikasjon for å lese og visualisere inkassodokumenter i norsk format.

## Hva gjør appen?

Appen lar deg laste inn inkassodokumenter (JSON) og vise innholdet strukturert — med saker, beløpsfordeling, fakturaer og innbetalinger — på en oversiktlig måte.

## Kom i gang

```bash
cd debt_viewer
npm install
npm start
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren.

## Bruk

- **Velg testdata** — last inn ferdiglagde eksempeldokumenter fra sidepanelet.
- **Last opp data** — last inn et eget inkassodokument i JSON-format.
- **Fjern** — klikk på et dokument i sidepanelet for å fjerne det.

Hvert dokument vises som et kort med:
- Totalbeløp (klikkbar nedtrekksmeny med beløpsfordeling)
- Saksinformasjon (inkassoselskap, saksnummer, betalingsfrist osv.)
- Fakturaer og innbetalinger som egne nedtrekksmenyer

Hvis flere dokumenter er lastet, vises et sammendragsort med samlet totalbeløp og kakediagram.

## Dokumentformat

Dokumenter må følge det norske inkassoskjemaet definert i [`src/testData/debtorDocumentSchemaNorsk.mjs`](src/testData/debtorDocumentSchemaNorsk.mjs).

## Scripts

| Kommando | Beskrivelse |
|---|---|
| `npm start` | Start utviklingsserver |
| `npm test` | Kjør tester |
| `npm run build` | Bygg for produksjon |