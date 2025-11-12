// ./src/pages/VacancyList.tsx
import { useState } from "react"
import { Table, Button, Input, Popconfirm, Tag } from "antd" // Tag qo'shildi
import { DeleteOutlined, EyeOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { Link, useNavigate } from "react-router-dom"

import { useVacancies, useVacancyMutations } from "../../hooks/useVacancy"
import type { VacancyStatus } from "../../services/vacancy" // VacancyStatus import qilindi

const VacancyList = () => {
  const { data: vacanciesResponse, isLoading } = useVacancies()
  const { remove } = useVacancyMutations()
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  const vacancies = vacanciesResponse?.results || []

  const filtered = vacancies?.filter((v: any) =>
    (v.title_uz ?? "").toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    try {
      await remove.mutateAsync(id.toString())
    } catch (error) {
      console.error("Failed to delete vacancy:", error)
    }
  }

  const getStatusColor = (status: VacancyStatus) => {
    switch (status) {
      case "active":
        return "green"
      case "waiting":
        return "blue"
      case "expired":
        return "red"
      default:
        return "default"
    }
  }

  const columns = [
    {
      title: "#",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Title (UZ)",
      dataIndex: "title_uz",
      key: "title_uz",
    },
    {
      title: "Description (UZ)", // 'Body (UZ)' o'rniga
      dataIndex: "description_uz", // 'body_uz' o'rniga
      key: "description_uz",
      render: (text: string) => (
        <div
          dangerouslySetInnerHTML={{ __html: text?.substring(0, 100) + (text.length > 100 ? "..." : "") }}
        />
      )
    },
    {
      title: "Deadline", // Yangi maydon
      dataIndex: "deadline",
      key: "deadline",
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Status", // Yangi maydon
      dataIndex: "status",
      key: "status",
      render: (status: VacancyStatus) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Actions",
      render: (record: any) => (
        <div className="flex gap-2">
          <Link to={`/vacancies/admin/${record.id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
          <Link to={`/vacancies/admin/${record.id}/edit`}>
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
      <div className="flex justify-between items-center mb-4">
        <Input.Search
          placeholder="Search vacancies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="w-full max-w-xs"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/vacancies/admin/create")}
        >
          Add New Vacancy
        </Button>
      </div>


      <Table rowKey="id" columns={columns} dataSource={filtered} loading={isLoading} />
    </>
  )
}

export default VacancyList;