import { useParams, Link } from "react-router-dom"
import { Card, Descriptions, Tag, Spin } from "antd"
import { useBuyProduct } from "../../hooks/useBuyProducts"
import { useAuth } from "../../hooks/useAuth"

export default function BuyProductDetail() {
    const { id } = useParams<{ id: string }>()
    const { data, isLoading } = useBuyProduct(id || "")
    const { useAdminUser } = useAuth()

    // Foydalanuvchi ma'lumotlarini olish
    const { data: userData, isLoading: isUserLoading } = useAdminUser(data?.user)

    if (isLoading) return <div className="p-6">Yuklanmoqda...</div>
    if (!data) return <div className="p-6">Ma’lumot topilmadi.</div>

    return (
        <div className="p-6">
            <Link to="/buy-products" className="text-blue-500 mb-4 inline-block">
                ← Ortga qaytish
            </Link>

            <Card title={`Buy Product #${data.id}`}>
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Telefon raqami"> <a
                        href={`tel:${data.phone_number}`}
                        className="text-blue-600 hover:underline"
                    >
                        {data.phone_number}
                    </a>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag
                            color={
                                data.status === "success"
                                    ? "green"
                                    : data.status === "rejected"
                                        ? "red"
                                        : "orange"
                            }
                        >
                            {data.status}
                        </Tag>
                    </Descriptions.Item>
                    {data.rejected_reason && (
                        <Descriptions.Item label="Rad etish sababi">
                            {data.rejected_reason}
                        </Descriptions.Item>
                    )}
                    <Descriptions.Item label="Fayl linki">
                        {data.file_link ? (
                            <a href={data.file_link} target="_blank" rel="noopener noreferrer">
                                Yuklab olish
                            </a>
                        ) : (
                            "—"
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Maxfiy kalit">
                        {data.secret_key || "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mahsulot ID">{data.product} ||  <Link to={`/products/admin/${data.product}`}>Mahsulotni Batafsil Ko'rmoq</Link></Descriptions.Item>

                    {/* 👤 Foydalanuvchi ma'lumotlari (email clickable) */}
                    <Descriptions.Item label="Foydalanuvchi">
                        {isUserLoading ? (
                            <Spin size="small" />
                        ) : userData ? (
                            <div>
                                <div>
                                    {userData.first_name} {userData.last_name}
                                </div>
                                <a
                                    href={`mailto:${userData.email}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {userData.email}
                                </a>
                            </div>
                        ) : (
                            "Ma’lumot topilmadi"
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Yaratilgan">
                        {new Date(data.created_at).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Yangilangan">
                        {new Date(data.updated_at).toLocaleString()}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    )
}
