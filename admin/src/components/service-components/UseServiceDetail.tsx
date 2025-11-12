import { useParams, Link } from "react-router-dom"
import { useUseService } from "../../hooks/useUseServices"
import { Card, Descriptions, Button } from "antd"

export default function UseServiceDetail() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useUseService(id || "")
  

  if (isLoading) return <div className="p-6">Yuklanmoqda...</div>
  if (!data) return <div className="p-6">Xizmat topilmadi.</div>

  return (
    <div className="p-6">
      <Link to="/use-services" className="text-blue-500 mb-4 inline-block">
        ← Ortga qaytish
      </Link>

      <Card title={data.service.title}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Foydalanuvchi">
            <b>{data.user.first_name} {data.user.last_name}</b>
            
          </Descriptions.Item>

          <Descriptions.Item label="Telefon">
            {data.phone ? (
              <Button type="link" onClick={() => { window.location.href = `tel:${data.phone}` }}>{data.phone}</Button>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Email">
            {data.user?.email ? (
              <Button type="link" onClick={() => { window.location.href = `mailto:${data.user.email}?subject=${encodeURIComponent(`Regarding ${data.service.title}`)}` }}>{data.user.email}</Button>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Qushimcha foydalanuvchi texti">
            {data.note || "Habar yo‘q"}
          </Descriptions.Item>

          <Descriptions.Item label="Services nomi">
            {data.service.title}
          </Descriptions.Item>

          <Descriptions.Item label="Kategoriya">
            {data.service.category?.name}
          </Descriptions.Item>

          <Descriptions.Item label="Foydalanilgan vaqti">
            {new Date(data.used_at).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Direct actions: clicking email opens mail client, clicking phone initiates call */}
    </div>
  )
}
