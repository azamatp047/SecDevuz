import { useParams, Link } from "react-router-dom";
import { Button, Spin, Card, Tabs, Space } from "antd";
import { useBlog } from "../../hooks/useBlog";
import parse from "html-react-parser";

const { TabPane } = Tabs;

const BlogDetail = () => {
  const { id } = useParams();
  const { data: blog, isLoading } = useBlog(id || "");

  if (isLoading) return <Spin fullscreen />;

  if (!blog) return <div className="p-6 text-red-500">Blog topilmadi!</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{blog.title_uz || "No title"}</h1>
        <Space>
          <Link to="/blog">
            <Button variant="filled" color="orange">Back to List</Button>
          </Link>
        <Link to={`/blog/${id}/edit`}>
          <Button type="primary">Edit</Button>
        </Link>
        </Space>
      </div>

      {/* Blog Content Tabs */}
      <Card>
        <Tabs defaultActiveKey="uz" centered>
          <TabPane tab="🇺🇿 O'zbekcha" key="uz">
            <h2 className="text-xl font-semibold mb-2">{blog.title_uz}</h2>
            <div className="prose dark:prose-invert max-w-none">
              {parse(blog.body_uz || "<p>Matn mavjud emas</p>")}
            </div>
          </TabPane>

          <TabPane tab="🇷🇺 Русский" key="ru">
            <h2 className="text-xl font-semibold mb-2">{blog.title_ru}</h2>
            <div className="prose dark:prose-invert max-w-none">
              {parse(blog.body_ru || "<p>Нет текста</p>")}
            </div>
          </TabPane>

          <TabPane tab="🇬🇧 English" key="en">
            <h2 className="text-xl font-semibold mb-2">{blog.title_en}</h2>
            <div className="prose dark:prose-invert max-w-none">
              {parse(blog.body_en || "<p>No content</p>")}
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Images */}
        {blog.image && blog.image.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Attached Images</h3>
            <div className="flex flex-wrap gap-4">
              
                <img
                  src={blog.image}
                  alt="Blog"
                  className="w-48 h-48 object-cover rounded-lg shadow"
                />
            </div>
          </div>
      )}
    </div>
  );
};

export default BlogDetail;
