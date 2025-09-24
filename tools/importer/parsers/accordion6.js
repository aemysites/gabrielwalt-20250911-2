/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required
  const headerRow = ['Accordion (accordion6)'];
  const rows = [headerRow];

  // Get all immediate children that are accordions
  const accordions = Array.from(element.querySelectorAll(':scope > .accordion'));

  accordions.forEach((accordion) => {
    // Title: find the toggle div, then the text div inside it
    const toggle = accordion.querySelector('.w-dropdown-toggle');
    let title = '';
    if (toggle) {
      // Find the first child with class 'paragraph-lg' (the title text)
      const titleDiv = toggle.querySelector('.paragraph-lg');
      if (titleDiv) {
        title = titleDiv;
      } else {
        // fallback: use the toggle itself
        title = toggle;
      }
    }

    // Content: find the dropdown list, then the rich text content inside
    const dropdownList = accordion.querySelector('.w-dropdown-list');
    let content = '';
    if (dropdownList) {
      // Find the first .rich-text or .w-richtext inside
      const richText = dropdownList.querySelector('.rich-text, .w-richtext');
      if (richText) {
        content = richText;
      } else {
        // fallback: use the dropdownList itself
        content = dropdownList;
      }
    }

    rows.push([title, content]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
