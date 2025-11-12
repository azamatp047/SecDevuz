// ./src/pages/VacancyDetail.tsx
import { useParams, useNavigate } from "react-router-dom"
import { useVacancy } from "../../hooks/useVacancy"
import { Button, Spin, Typography, Image, Tag } from "antd"
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons"
import type { VacancyStatus } from "../../services/vacancy" // <-- O'zgarish: type-only import

const { Title, Text, Paragraph } = Typography

const VacancyDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: vacancy, isLoading, isError, error } = useVacancy(id || "")

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading Vacancy..." />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        <Title level={3}>Error loading vacancy</Title>
        <Paragraph>{(error as Error).message}</Paragraph>
        <Button type="primary" onClick={() => navigate("/vacancies/admin")}>
          Go Back to List
        </Button>
      </div>
    )
  }

  if (!vacancy) {
    return (
      <div className="p-6 text-center">
        <Title level={3}>Vacancy not found</Title>
        <Button type="primary" onClick={() => navigate("/vacancies/admin")}>
          Go Back to List
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => navigate("/vacancies/admin")} icon={<ArrowLeftOutlined />}>
          Back to Vacancies
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate(`/vacancies/admin/${vacancy.id}/edit`)}
        >
          Edit Vacancy
        </Button>
      </div>

      <Title level={2} className="mb-4">{vacancy.title_uz}</Title>
      <Text type="secondary" className="block mb-2">Created: {new Date(vacancy.created_at || "").toLocaleDateString()}</Text>
      <Text type="secondary" className="block mb-4">Deadline: {new Date(vacancy.deadline || "").toLocaleString()}</Text>
      <div className="mb-4">
        <Text strong>Status: </Text>
        <Tag color={getStatusColor(vacancy.status)}>{vacancy.status.toUpperCase()}</Tag>
      </div>


      {vacancy.image && (
        <div className="mb-6">
          <Image
            src={vacancy.image}
            alt={vacancy.title_uz}
            className="w-full max-h-96 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="mb-6">
        <Title level={4}>Title (UZ):</Title>
        <Paragraph>{vacancy.title_uz}</Paragraph>

        <Title level={4}>Title (RU):</Title>
        <Paragraph>{vacancy.title_ru}</Paragraph>

        <Title level={4}>Title (EN):</Title>
        <Paragraph>{vacancy.title_en}</Paragraph>
      </div>

      <div className="mb-6">
        <Title level={4}>Description (UZ):</Title>
        <div dangerouslySetInnerHTML={{ __html: vacancy.description_uz }} className="prose max-w-none" />

        <Title level={4} className="mt-4">Description (RU):</Title>
        <div dangerouslySetInnerHTML={{ __html: vacancy.description_ru }} className="prose max-w-none" />

        <Title level={4} className="mt-4">Description (EN):</Title>
        <div dangerouslySetInnerHTML={{ __html: vacancy.description_en }} className="prose max-w-none" />
      </div>
    </div>
  )
}

export default VacancyDetail