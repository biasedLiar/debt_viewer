import '../testData/debtorDocumentSchemaNorsk.mjs';

// The schema module is imported as the source-of-truth location for the contract.
// This file defines the app-level interpretation used by render/validation utilities.

export const FIELD_TYPES = Object.freeze({
  STRING: 'string',
  NUMBER: 'number',
  ARRAY: 'array',
  OBJECT: 'object',
});

export const FIELD_FALLBACKS = Object.freeze({
  [FIELD_TYPES.STRING]: 'Not provided',
  [FIELD_TYPES.NUMBER]: 'Not provided',
  [FIELD_TYPES.ARRAY]: [],
  [FIELD_TYPES.OBJECT]: null,
});

export const DOCUMENT_CONTRACT = Object.freeze({
  required: [
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
  ],
  optional: [
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
    { path: 'saker[].detaljer.mottakerKonto', type: FIELD_TYPES.STRING },
    { path: 'saker[].detaljer.KID', type: FIELD_TYPES.STRING },
    { path: 'saker[].detaljer.notater', type: FIELD_TYPES.STRING },
  ],
});

export function getFallbackForType(type) {
  return Object.prototype.hasOwnProperty.call(FIELD_FALLBACKS, type)
    ? FIELD_FALLBACKS[type]
    : null;
}
