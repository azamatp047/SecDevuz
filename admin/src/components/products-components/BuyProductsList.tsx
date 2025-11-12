import { Table, Button, Popconfirm, Tag } from "antd"
import { Link } from "react-router-dom"
import { useBuyProducts, useBuyProductMutation } from "../../hooks/useBuyProducts"
import type { ColumnsType } from "antd/es/table"
import type { BuyProduct } from "../../services/products"

export default function BuyProductsList() {
  const { data: products = [], isLoading } = useBuyProducts()
  const { remove } = useBuyProductMutation()

  const handleDelete = (id: number) => {
    remove.mutate(String(id))
  }

  const columns: ColumnsType<BuyProduct> = [
    {
      title: "#",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "Telefon raqami",
      dataIndex: "phone_number",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: BuyProduct["status"]) => {
        const color =
          status === "success" ? "green" : status === "rejected" ? "red" : "orange"
        return <Tag color={color}>{status}</Tag>
      },
    },
    {
      title: "Yaratilgan sana",
      dataIndex: "created_at",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Amallar",
      render: (record) => (
        <div className="flex space-x-2">
          <Link to={`/buy-products/${record.id}`}>
            <Button type="primary">Batafsil</Button>
          </Link>
          <Popconfirm
            title="Rostdan ham o‘chirmoqchimisiz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo‘q"
          >
            <Button danger loading={remove.isPending}>
              O‘chirish
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Buy Products ro‘yxati</h1>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={products}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}
