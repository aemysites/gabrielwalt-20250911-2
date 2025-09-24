/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct children (should be two divs, each with an image)
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Only proceed if we have at least two columns
  if (children.length < 2) return;

  // Each child is a column cell. Use the whole div for resilience.
  const columnsRow = children;

  // Table structure: header row, then one row with two columns
  const tableCells = [
    ['Columns (columns2)'],
    columnsRow
  ];

  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
