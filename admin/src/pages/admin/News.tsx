import { PlusOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useNavigate } from "react-router-dom"
import BlogList from "../../components/news-components/BlogList"


const News = () => {
    const navigate = useNavigate()
  return (
    <div className="p-6">
        <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Blog / News</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/blog/create")}
        >
          Add New Blog
        </Button>
      </div>

      {/* BlogList Component */}
      <BlogList />
      
    </div>
  )
}

export default News