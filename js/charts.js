// components/charts.js

export function charts(role) {
  let chartBlocks = "";

  switch (role) {
    case "Admin":
      chartBlocks = `
        <div class="chart">[Revenue Chart Placeholder]</div>
        <div class="chart">[Production Trend Chart Placeholder]</div>
      `;
      break;

    case "Manager":
      chartBlocks = `
        <div class="chart">[Branch Revenue Chart]</div>
        <div class="chart">[Supplier Orders Chart]</div>
      `;
      break;

    case "Baker":
      chartBlocks = `
        <div class="chart">[Daily Batches Chart]</div>
        <div class="chart">[Ingredient Usage Chart]</div>
      `;
      break;

    case "Staff":
      chartBlocks = `
        <div class="chart">[Orders Completed Chart]</div>
        <div class="chart">[Delivery Status Chart]</div>
      `;
      break;
  }

  return `<section class="charts">${chartBlocks}</section>`;
}
