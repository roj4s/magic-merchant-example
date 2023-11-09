import { Box, Table } from "@mui/joy";

export default function OrderTable({ products }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Table>
        <thead>
          <tr>
            <th style={{ width: "40%" }}>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod._id}>
              <td>{prod.name}</td>
              <td>{prod.quantity}</td>
              <td>{prod.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} style={{ textAlign: "right" }}>
              <b>Total</b>
            </td>
            <td>
              <b>
                {products
                  .reduce((sum, prod) => sum + prod.price * prod.quantity, 0)
                  .toFixed(2)}
              </b>
            </td>
          </tr>
        </tfoot>
      </Table>
    </Box>
  );
}
