/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child divs
  const getDirectDivs = (parent) => Array.from(parent.querySelectorAll(':scope > div'));

  // Table header row
  const headerRow = ['Tabs (tabs5)'];
  const rows = [headerRow];

  // Find tab menu and tab content containers
  const children = getDirectDivs(element);
  if (children.length < 2) return; // Defensive: need menu and content

  // Tab menu: get tab labels
  const tabMenu = children.find(div => div.classList.contains('w-tab-menu'));
  // Tab content: get tab panes
  const tabContent = children.find(div => div.classList.contains('w-tab-content'));
  if (!tabMenu || !tabContent) return;

  // Get all tab links (labels)
  const tabLinks = Array.from(tabMenu.querySelectorAll('a.w-tab-link'));
  // Get all tab panes (content)
  const tabPanes = Array.from(tabContent.querySelectorAll(':scope > div.w-tab-pane'));

  // Defensive: match tab labels to panes by data-w-tab
  tabLinks.forEach((tabLink, i) => {
    // Get tab label text
    let labelDiv = tabLink.querySelector('div');
    let tabLabel = labelDiv ? labelDiv.textContent.trim() : tabLink.textContent.trim();
    // Find matching pane by data-w-tab
    let tabName = tabLink.getAttribute('data-w-tab');
    let pane = tabPanes.find(p => p.getAttribute('data-w-tab') === tabName);
    if (!pane) return;

    // Tab content: use the direct grid div inside pane (for resilience)
    let contentDiv = pane.querySelector(':scope > div');
    let tabContentCell;
    if (contentDiv) {
      tabContentCell = contentDiv;
    } else {
      // Fallback: use pane itself
      tabContentCell = pane;
    }
    // Add row: [tab label, tab content element]
    rows.push([tabLabel, tabContentCell]);
  });

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(table);
}
