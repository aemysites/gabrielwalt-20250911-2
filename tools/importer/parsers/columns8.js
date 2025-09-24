/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children of a node by tag name
  function getDirectChildrenByTag(parent, tag) {
    return Array.from(parent.children).filter((el) => el.tagName.toLowerCase() === tag.toLowerCase());
  }

  // Find the grid-layout container (the columns wrapper)
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Each direct child of grid is a column
  const columns = Array.from(grid.children);

  // Defensive: Only keep columns that have meaningful content
  const validColumns = columns.filter(col => col && col.childNodes.length > 0);

  // Build the columns row: each cell is the content of a column
  const columnsRow = validColumns.map((col) => {
    // For the first column (logo + social), keep the whole block
    // For other columns (ul lists), keep the whole block
    return col;
  });

  // Compose the table
  const headerRow = ['Columns (columns8)'];
  const tableRows = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
