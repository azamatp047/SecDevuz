import { Card, Button, Spin, Row, Col } from "antd"
import { useDashboard, useDashboardRefresh } from "../../hooks/useDashboard"
import { ReloadOutlined } from "@ant-design/icons"

const Dashboard = () => {
  const { data, isLoading, isFetching } = useDashboard()
  const refresh = useDashboardRefresh()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <Button
          icon={<ReloadOutlined />}
          onClick={refresh}
          loading={isFetching}
        >
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {data?.map((item) => (
            <Col xs={24} sm={12} md={6} key={item.model}>
              <Card
                className="rounded-2xl shadow-md hover:shadow-lg transition-shadow"
                title={item.model}
                bordered={false}
              >
                <p className="text-4xl font-bold text-center text-blue-600">
                  {item.count}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default Dashboard
