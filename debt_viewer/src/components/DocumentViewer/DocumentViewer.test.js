import { fireEvent, render, screen } from '@testing-library/react';
import DocumentViewer from './DocumentViewer';
import mockDocument from '../../testData/norsk/mock_debtor_document_norsk.json';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

describe('DocumentViewer', () => {
  test('renders a full valid document', () => {
    render(<DocumentViewer documentData={clone(mockDocument)} warnings={[]} />);

    expect(screen.getAllByText('MockCreditor AS').length).toBeGreaterThan(0);
    expect(screen.getByText('Fakturaer (2)')).toBeInTheDocument();
    expect(screen.getByText(/Sak 1/)).toBeInTheDocument();
  });

  test('renders missing optional field fallback', () => {
    const doc = clone(mockDocument);
    delete doc.saker[0].identifikatorer.referansenummer;

    render(<DocumentViewer documentData={doc} warnings={[]} />);

    expect(screen.getByText('Not provided')).toBeInTheDocument();
  });

  test('renders missing required field fallback', () => {
    const doc = clone(mockDocument);
    delete doc.saker[0].belop.totalbelop;

    render(<DocumentViewer documentData={doc} warnings={[]} />);

    expect(screen.getByText('Not provided')).toBeInTheDocument();
  });

  test('renders malformed value without crashing', () => {
    const doc = clone(mockDocument);
    doc.totalbelop = 'malformed-amount';

    render(<DocumentViewer documentData={doc} warnings={[]} />);

    expect(screen.getByText('malformed-amount')).toBeInTheDocument();
  });

  test('shows invoice dropdown closed by default for cases with invoices', () => {
    render(<DocumentViewer documentData={clone(mockDocument)} warnings={[]} />);

    const invoiceSummary = screen.getAllByText(/Fakturaer \(/i)[0];
    expect(invoiceSummary.closest('details')).not.toHaveAttribute('open');

    fireEvent.click(invoiceSummary);
    expect(invoiceSummary.closest('details')).toHaveAttribute('open');
  });
});
