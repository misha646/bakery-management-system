// components/table.js

export function dataTable(role) {
  let tableContent = "";

  switch (role) {
    case "Admin":
      tableContent = `
        <h3>Recent Orders</h3>
        <table>
          <tr><th>Order ID</th><th>Customer</th><th>Status</th></tr>
          <tr><td>101</td><td>John Doe</td><td>Completed</td></tr>
          <tr><td>102</td><td>Jane Smith</td><td>Pending</td></tr>
          <tr><td>103</td><td>Michael Lee</td><td>Cancelled</td></tr>
        </table>
      `;
      break;

    case "Manager":
      tableContent = `
        <h3>Supplier Deliveries</h3>
        <table>
          <tr><th>Supplier</th><th>Item</th><th>Status</th></tr>
          <tr><td>FreshFlour Co.</td><td>Flour</td><td>Delivered</td></tr>
          <tr><td>DairyBest</td><td>Milk</td><td>Pending</td></tr>
        </table>
      `;
      break;

    case "Baker":
      tableContent = `
        <h3>Production Batches</h3>
        <table>
          <tr><th>Batch ID</th><th>Item</th><th>Status</th></tr>
          <tr><td>B001</td><td>Cakes</td><td>Completed</td></tr>
          <tr><td>B002</td><td>Bread</td><td>In Progress</td></tr>
        </table>
      `;
      break;

    case "Staff":
      tableContent = `
        <h3>Assigned Deliveries</h3>
        <table>
          <tr><th>Delivery ID</th><th>Customer</th><th>Status</th></tr>
          <tr><td>D001</td><td>Sarah Connor</td><td>Delivered</td></tr>
          <tr><td>D002</td><td>Tom Hardy</td><td>Pending</td></tr>
        </table>
      `;
      break;
  }

  return `<section class="table">${tableContent}</section>`;
}