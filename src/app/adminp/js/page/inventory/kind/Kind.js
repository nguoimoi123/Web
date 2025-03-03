import { Table } from "flowbite-react";

export default function product({ products, onDelete }) {
  return (
    <Table>
      <Table.Head>
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Description</Table.HeadCell>
        <Table.HeadCell>Titile</Table.HeadCell>
        <Table.HeadCell>Stock</Table.HeadCell>
        <Table.HeadCell>Image</Table.HeadCell>
        <Table.HeadCell>Price</Table.HeadCell>
        <Table.HeadCell>Actions</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {products.map((product) => (
          <Table.Row key={product.product_id}>
            <Table.Cell>{product.product_id}</Table.Cell>
            <Table.Cell>{product.product_name}</Table.Cell>
            <Table.Cell>{product.product_description}</Table.Cell>
            <Table.Cell>{product.product_titile}</Table.Cell>
            <Table.Cell>{product.product_stock}</Table.Cell>
            <Table.Cell>{product.product_image}</Table.Cell>        
            <Table.Cell>{product.product_price}</Table.Cell>
            <Table.Cell>
              <button onClick={() => onDelete(product.product_id)} className="text-red-600 ml-2">
                Delete
              </button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
