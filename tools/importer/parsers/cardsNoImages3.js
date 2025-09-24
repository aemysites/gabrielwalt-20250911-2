/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name and variant as the header row
  const headerRow = ['Cards (cardsNoImages3)'];

  // Get all immediate children (each card)
  const cardDivs = element.querySelectorAll(':scope > div');

  // Each cardDiv contains: icon (div.icon > img), and a p (description)
  // The visual structure does not use the icon as a heading, so we ignore it for 'no images' variant
  // The card text is in the <p> element, but there is no heading in the HTML
  // We'll use only the <p> for each card row

  const rows = Array.from(cardDivs).map(cardDiv => {
    // Defensive: find the <p> element inside the cardDiv
    const p = cardDiv.querySelector('p');
    // If not found, fallback to the whole cardDiv
    return [p ? p : cardDiv];
  });

  // Build the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
