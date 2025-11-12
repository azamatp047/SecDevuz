import { Card, Descriptions, Button } from "antd"
import { useNavigate, useParams } from "react-router-dom"
import { useUser } from "../../hooks/useUsers"

const UsersDetail = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { data, isLoading } = useUser(id!)

    return (
        <div className="p-6">
            <Button
                type="default"
                className="mb-4"
                onClick={() => navigate(-1)}
            >
                Back
            </Button>

            <Card
                title={`User Detail - ID ${id}`}
                loading={isLoading}
                className="rounded-2xl shadow-sm"
            >
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Username">{data?.username}</Descriptions.Item>
                    <Descriptions.Item label="Email">{data?.email}</Descriptions.Item>
                    <Descriptions.Item label="First Name">{data?.first_name}</Descriptions.Item>
                    <Descriptions.Item label="Last Name">{data?.last_name}</Descriptions.Item>
                    <Descriptions.Item label="Role">{data?.role}</Descriptions.Item>
                    <Descriptions.Item label="Phone">{data?.phone}</Descriptions.Item>
                    <Descriptions.Item label="Date Joined">{data ? new Date(data.date_joined).toLocaleString() : ''}</Descriptions.Item>
                    <Descriptions.Item label="Last Login">{data?.last_login ? new Date(data.last_login).toLocaleString() : 'Never'}</Descriptions.Item>
                    <Descriptions.Item label="Active Status">{data?.is_active ? 'Active' : 'Inactive'}</Descriptions.Item>
                    <Descriptions.Item label="Staff Status">{data?.is_staff ? 'Staff' : 'Not Staff'}</Descriptions.Item>
                    <Descriptions.Item label="Superuser Status">{data?.is_superuser ? 'Superuser' : 'Not Superuser'}</Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    )
}

export default UsersDetail
