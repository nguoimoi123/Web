import { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import Image from "next/image";
import { KindFormModal } from "./KindFormModal";
import { fetchKinds, addKind, updateKind, deleteKind } from "./kindActions";

const API_URL = "http://localhost:3000/api/inventory/kind";

export default function KindsPage() {
  const [kinds, setKinds] = useState([]);
  const [categorys, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingKinds, setLoadingKinds] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    kind_id: null,
    kind_name: "",
    categor_name: "",
    category_id: "", // Thêm category_id vào form
  });
  const [selectedKind, setSelectedKind] = useState('');

  const fetchKindsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch Kinds.");
      }
      const data = await response.json();
      console.log("Fetched Kinds:", data); // Kiểm tra dữ liệu trả về
      setKinds(Array.isArray(data) ? data : []);
    } catch (error) {
      setError("Unable to load Kinds.");
      console.error("Error fetching Kinds:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  const fetchKinds = async () => {
    setLoadingKinds(true);
    try {
      const response = await fetch('/api/inventory/kind');
      if (!response.ok) {
        throw new Error("Failed to load kinds.");
      }
      const data = await response.json();
      setKinds(data);
    } catch (error) {
      setError("Unable to load kinds.");
      console.error("Lỗi khi lấy danh mục:", error);
    } finally {
      setLoadingKinds(false);
    }
  };

  const handleEdit = (kind) => {
    setIsEditing(true);
    setForm({
      ...kind,
      kind_name: kind.kind_name, 
      kind_id: kind.kind_id, 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    console.log("Form data before submit:", form);
  
    // Kiểm tra các trường bắt buộc
    if (!form.kind_name || !form.stock || !form.price || !form.kind_id) {
      setError("Please make sure all required fields are filled.");
      return;
    }
  
    try {
      const response = isEditing
        ? await fetch(`${API_URL}/${form.kind_id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...form,
              kind_name: undefined,  // Không gửi category_name
            }),
          })
        : await fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...form,
              kind_name: undefined,  // Không gửi category_name
            }),
          });
  
      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error:", errorData);  // In chi tiết lỗi API
        throw new Error(errorData || "Error submitting kind");
      }
  
      const responseData = await response.json();
  
      console.log("Updated kind:", responseData);  // Kiểm tra dữ liệu trả về từ API
  
      setKinds((prev) =>
        isEditing
          ? prev.map((prod) =>
              prod.kind_id === responseData.kind_id ? responseData : prod
            )
          : [...prev, responseData]
      );
  
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message);
    }
  };
  
  

  const handleDelete = async (kindId) => {
    if (confirm("Are you sure you want to delete this kind?")) {
      try {
        const response = await fetch(`${API_URL}/${kindId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Error deleting kind.");
        }

        setKinds((prev) =>
          prev.filter((kind) => kind.kind_id !== kindId)
        );
      } catch (error) {
        setError("Unable to delete kind.");
        console.error("Error deleting kind:", error);
      }
    }
  };

  useEffect(() => {
    fetchKinds();
    fetchKindsData();
  }, []);

  const filteredKinds = selectedKind
  ? Kinds.filter(
      (kind) => kind.kind_id === parseInt(selectedKind)
    )
  : Kinds;




  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Kinds</h1>
      {loading && <div className="text-center text-blue-600">Loading...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      <div className="mb-4">
      <select
        onChange={(e) => setSelectedKind(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="">All Types</option>
        {kinds.map((kind) => (
          <option key={kind.kind_id} value={kind.kind_id}>
            {kind.kind_name}
          </option>
        ))}
      </select>


      </div>

      <button
        onClick={() => {
          setIsEditing(false);
          setForm({
            kind_id: null,
            kind_name: "",
            description: "",
            title: "",
            stock: "",
            img_url: "",
            price: "",
            kind_id: "",
          });
          setIsModalOpen(true);
        }}
        className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition duration-300"
      >
        Add Kind
      </button>

      {!loading && !error && (
        <>
          {filteredKinds.length === 0 ? (
            <div className="text-center text-gray-600 mt-6">No Kinds available. Please add one!</div>
          ) : (
            <Table>
              <Table.Head>
                <Table.HeadCell>ID</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Description</Table.HeadCell>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Stock</Table.HeadCell>
                <Table.HeadCell>Image</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
                <Table.HeadCell>Types</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {filteredKinds.map((kind) => (
                  <Table.Row key={kind.kind_id}>
                    <Table.Cell>{kind.kind_id}</Table.Cell>
                    <Table.Cell>{kind.kind_name}</Table.Cell>
                    <Table.Cell>{kind.description}</Table.Cell>
                    <Table.Cell>{kind.title}</Table.Cell>
                    <Table.Cell>{kind.stock}</Table.Cell>
                    <Table.Cell>
                      <Image
                        src={kind.img_url || "/placeholder-image.png"}
                        alt={kind.kind_name || "Kind image"}
                        width={64}
                        height={64}
                        className="object-cover rounded"
                      />
                    </Table.Cell>
                    <Table.Cell>{kind.price}</Table.Cell>
                    <Table.Cell>
                      {kinds.find((cat) => cat.kind_id === kind.kind_id)?.kind_name || "Unknown"}
                    </Table.Cell>

                    <Table.Cell>
                      <button onClick={() => handleEdit(kind)} className="text-blue-600">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(kind.kind_id)}
                        className="text-red-600 ml-2"
                      >
                        Delete
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </>
      )}

      <KindFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        kinds={kinds}
      />
    </div>
  );
}
