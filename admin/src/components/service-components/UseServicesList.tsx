import { Table, Button, Popconfirm } from "antd"
import { Link } from "react-router-dom"
import { useUseServices, useUseServiceMutation } from "../../hooks/useUseServices"
import type { ColumnsType } from "antd/es/table"
import type { UseServiceItem } from "../../services/service"

export default function UseServicesList() {
  const { data: services = [], isLoading } = useUseServices()
  const { remove } = useUseServiceMutation()

  const handleDelete = (id: number) => {
    remove.mutate(String(id))
  }

  const columns: ColumnsType<UseServiceItem> = [
    {
      title: "#",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "Foydalanuvchi",
      render: (record) => (
        <div>
          <div>{record.user.first_name} {record.user.last_name}</div>
          <div className="text-gray-500 text-sm">{record.user.email}</div>
        </div>
      ),
    },
    {
      title: "Telefon",
      dataIndex: "phone"
    },
    {
      title: "Xizmat nomi",
      dataIndex: ["service", "title"],
    },
    {
      title: "Amallar",
      render: (record) => (
        <div className="flex space-x-2">
          <Link to={`/use-services/${record.id}`}>
            <Button type="primary">Batafsil</Button>
          </Link>
          <Popconfirm
            title="Rostdan ham o‘chirmoqchimisiz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo‘q"
          >
            <Button danger loading={remove.isPending}>O‘chirish</Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Use Services ro‘yxati</h1>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={services}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}
