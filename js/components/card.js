// js/components/card.js

/**
 * Renders a simple card block
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string} props.content - Main content
 * @param {string} [props.footer] - Optional footer
 */
export function renderCard({ title, content, footer = "" }) {
  return `
    <div class="card">
      <h4>${title}</h4>
      <p>${content}</p>
      ${footer ? `<small>${footer}</small>` : ""}
    </div>
  `;
}