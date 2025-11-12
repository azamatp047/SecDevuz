import { Table, Button, Popconfirm, Space, Tag } from "antd"
import { useNavigate } from "react-router-dom"
import { useUsers, useUserDelete } from "../../hooks/useUsers"

const UsersList = () => {
  const navigate = useNavigate()
  const { data, isLoading } = useUsers()
  const deleteMutation = useUserDelete()

  const handleDelete = (id: number) => {
    deleteMutation.mutate(String(id))
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Full Name",
      key: "fullname",
      render: (_: any, record: any) => (
        <span>{`${record.first_name} ${record.last_name || ""}`}</span>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            onClick={() => navigate(`/users/${record.id}`)}
          >
            View
          </Button>
          <Popconfirm
            title="Are you sure delete this user?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="p-6 rounded-2xl shadow-sm">
      <h1 className="text-xl font-semibold mb-4">Users List</h1>
      <Table
        rowKey="id"
        columns={columns}
        loading={isLoading}
        dataSource={data?.results || []}
        pagination={{
          total: data?.count,
          pageSize: 10,
        }}
      />
    </div>
  )
}

export default UsersList
