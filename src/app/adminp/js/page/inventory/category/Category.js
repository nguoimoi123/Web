import { Table } from "flowbite-react";

export default function Category({ categories, onDelete }) {
  return (
    <Table>
      <Table.Head>
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Actions</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {categories.map((category) => (
          <Table.Row key={category.category_id}>
            <Table.Cell>{category.category_id}</Table.Cell>
            <Table.Cell>{category.category_name}</Table.Cell>
            <Table.Cell>
              <button onClick={() => onDelete(category.category_id)} className="text-red-600 ml-2">
                Delete
              </button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
