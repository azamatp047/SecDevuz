import { useState } from "react"
import { Table, Button, Input, Popconfirm } from "antd"
import { DeleteOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons"

import { useBlogs, useBlogMutations } from "../../hooks/useBlog"
import { Link } from "react-router-dom"

const BlogList = () => {
  const { data: blogs, isLoading } = useBlogs()
  const { remove } = useBlogMutations()
  const [search, setSearch] = useState("")

    
  const filtered = blogs?.filter((b: any) =>
    (b.title ?? "").toLowerCase().includes(search.toLowerCase())
  )

  console.log(blogs);
  

  const handleDelete = async (id: number) => {
    try {
      await remove.mutateAsync(id.toString())
    } catch {
      console.log("Failed to delete blog")
    }
  }

  

  const columns = [
    {
      title: "#",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
        title: "Body",
        dataIndex: "body",
        render: (record: any) => (
            <div
                dangerouslySetInnerHTML={{ __html: record?.substring(0, 100) }}
            />
        )
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render : (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      render: (record: any) => (
        <div className="flex gap-2">
          <Link to={`/blog/${record.id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
          <Link to={`/blog/${record.id}/edit`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <>
      <Input.Search
        placeholder="Search blog..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        allowClear
        className="mb-4"
      />

      <Table rowKey="id" columns={columns} dataSource={filtered} loading={isLoading} />
    </>
  )
}

export default BlogList