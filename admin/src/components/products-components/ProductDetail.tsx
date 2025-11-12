// src/pages/ProductDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../../hooks/useProducts";
import { Button, Spin, Typography, Image, Card, Descriptions } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Item } = Descriptions;

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading, isError, error } = useProduct(id || "");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading Product..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        <Title level={3}>Error loading product</Title>
        <Paragraph>{(error as Error).message}</Paragraph>
        <Button type="primary" onClick={() => navigate("/products/admin")}>
          Go Back to List
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center">
        <Title level={3}>Product not found</Title>
        <Button type="primary" onClick={() => navigate("/products/admin")}>
          Go Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => navigate("/products/admin")} icon={<ArrowLeftOutlined />}>
          Back to Products
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate(`/products/admin/${product.id}/edit`)}
        >
          Edit Product
        </Button>
      </div>

      <Title level={2} className="mb-4">{product.title_en}</Title>

      <Card className="mb-6">
        <div className="flex flex-wrap gap-6">
          {product.image && (
            <div className="flex-shrink-0">
              <Image
                src={product.image}
                alt={product.title_en}
                className="w-48! h-48! object-cover rounded-lg shadow-sm"
              />
            </div>
          )}
          <div className="flex-grow">
            <Descriptions column={1} bordered>
              <Item label="Category (UZ)">{product.category?.name_uz || "N/A"}</Item>
              <Item label="Category (RU)">{product.category?.name_ru || "N/A"}</Item>
              <Item label="Category (EN)">{product.category?.name_en || "N/A"}</Item>
              <Item label="Price">{parseFloat(product.price).toLocaleString()} UZS</Item>
              <Item label="Title (UZ)">{product.title_uz || "N/A"}</Item>
              <Item label="Title (RU)">{product.title_ru || "N/A"}</Item>
              <Item label="Title (EN)">{product.title_en || "N/A"}</Item>
            </Descriptions>
          </div>
        </div>
      </Card>

      <div className="mb-6">
        <Title level={4}>Description (UZ):</Title>
        <div dangerouslySetInnerHTML={{ __html: product.description_uz || "N/A" }} className="prose max-w-none" />

        <Title level={4} className="mt-4">Description (RU):</Title>
        <div dangerouslySetInnerHTML={{ __html: product.description_ru || "N/A" }} className="prose max-w-none" />

        <Title level={4} className="mt-4">Description (EN):</Title>
        <div dangerouslySetInnerHTML={{ __html: product.description_en || "N/A" }} className="prose max-w-none" />
      </div>
    </div>
  );
};

export default ProductDetail;