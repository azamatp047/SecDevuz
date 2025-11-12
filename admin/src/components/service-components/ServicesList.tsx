import { Table, Button, Popconfirm, Space, Image } from "antd"
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { useServices, useServiceMutations } from "../../hooks/useService"
import { Link } from "react-router-dom"

const ServiceList = () => {
  const { data: services, isLoading } = useServices()
  const { remove } = useServiceMutations()

  const handleDelete = (id: string) => {
    remove.mutate(id)
  }

  const columns = [
    {
      title: "Rasm",
      dataIndex: "image",
      key: "image",
      render: (img: string) =>
        img ? <Image src={img} alt="service" width={60} /> : "—",
    },
    {
      title: "Title (UZ)",
      dataIndex: "title_uz",
      key: "title_uz",
    },
    {
      title: "Title (EN)",
      dataIndex: "title_en",
      key: "title_en",
    },
    {
      title: "Title (RU)",
      dataIndex: "title_ru",
      key: "title_ru",
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Link to={`/services/${record.id}/edit`}>
            <Button type="primary" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Haqiqatan o‘chirmoqchimisiz?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Xizmatlar</h2>
        <Link to="/services/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Yangi xizmat qo‘shish
          </Button>
        </Link>
      </div>

      <Table
        loading={isLoading}
        columns={columns}
        dataSource={services || []}
        rowKey="id"
      />
    </div>
  )
}

export default ServiceList;
