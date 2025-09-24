/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from each card anchor
  function extractCardInfo(cardAnchor) {
    // Find the image (mandatory)
    const img = cardAnchor.querySelector('img');
    // Find the text content container (the div after the image)
    const contentDiv = cardAnchor.querySelector('div:not(.w-layout-grid)');
    if (!img || !contentDiv) return null;

    // Extract tag and read time (optional, can be included at top)
    const metaRow = contentDiv.querySelector('.flex-horizontal');
    let meta = null;
    if (metaRow) {
      meta = metaRow;
    }

    // Extract title (h3)
    const title = contentDiv.querySelector('h3');
    // Extract description (p)
    const desc = contentDiv.querySelector('p');
    // Extract CTA (the last div with text 'Read')
    let cta = null;
    const ctaDivs = Array.from(contentDiv.querySelectorAll('div'));
    for (let div of ctaDivs) {
      if (div.textContent.trim().toLowerCase() === 'read') {
        // Make a link using the cardAnchor's href
        cta = document.createElement('a');
        cta.href = cardAnchor.href;
        cta.textContent = 'Read';
        break;
      }
    }

    // Compose the text cell content
    const textCell = document.createElement('div');
    if (meta) textCell.appendChild(meta.cloneNode(true));
    if (title) textCell.appendChild(title.cloneNode(true));
    if (desc) textCell.appendChild(desc.cloneNode(true));
    if (cta) textCell.appendChild(cta);

    return [img, textCell];
  }

  // Get all direct child anchors (each is a card)
  const cardAnchors = Array.from(element.querySelectorAll(':scope > a'));

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards4)']);

  // Card rows
  cardAnchors.forEach(cardAnchor => {
    const cardData = extractCardInfo(cardAnchor);
    if (cardData) {
      rows.push(cardData);
    }
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
