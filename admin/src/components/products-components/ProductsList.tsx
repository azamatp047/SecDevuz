// src/components/ProductsList.tsx
import { useState } from "react";
import { Table, Button, Input, Popconfirm, Avatar } from "antd";
import { DeleteOutlined, EyeOutlined, EditOutlined, PlusOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useProducts, useProductMutations } from "../../hooks/useProducts";

const ProductsList = () => {
  const { data: productsResponse, isLoading } = useProducts();
  const { remove } = useProductMutations();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const products = productsResponse?.results || [];

  const filteredProducts = products.filter(
    (product) =>
      product.title_en?.toLowerCase().includes(search.toLowerCase()) ||
      product.title_uz?.toLowerCase().includes(search.toLowerCase()) ||
      product.title_ru?.toLowerCase().includes(search.toLowerCase()) ||
      product.category?.name_en?.toLowerCase().includes(search.toLowerCase()) // Check category name
  );

  const handleDelete = async (id: number) => {
    try {
      await remove.mutateAsync(id.toString());
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const columns = [
    {
      title: "#",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (image ? <Avatar src={image} /> : <Avatar icon={<ShoppingOutlined />} />),
    },
    {
      title: "Title (EN)",
      dataIndex: "title_en",
      key: "title_en",
    },
    {
      title: "Category (EN)", // Updated title
      dataIndex: ["category", "name_en"], // Access nested property
      key: "category_en",
      render: (text: string) => text || "N/A", // Handle potential null/undefined
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: string) => `${parseFloat(price).toLocaleString()} UZS`,
    },
    {
      title: "Actions",
      render: (record: any) => (
        <div className="flex gap-2">
          <Link to={`/products/admin/${record.id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
          <Link to={`/products/admin/${record.id}/edit`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Input.Search
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="w-full max-w-xs"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/products/admin/create")}
        >
          Add New Product
        </Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={filteredProducts} loading={isLoading} />
    </>
  );
};

export default ProductsList;