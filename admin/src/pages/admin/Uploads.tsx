import { useUploads, useUploadMutations } from "../../hooks/useUpload";
import {
  Upload,
  Button,
  Card,
  Popconfirm,
  message,
  Row,
  Col,
  Spin,
  Typography,
  Tooltip,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CopyOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import { useState } from "react";

const { Meta } = Card;
const { Title } = Typography;

const Uploads = () => {
  const { data, isLoading, refetch } = useUploads();
  const { create, remove } = useUploadMutations();
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const images = data || [];

  // 🔹 Upload qilish
  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      await create.mutateAsync(formData);
      message.success("Image uploaded successfully!");
      onSuccess?.("ok");
    } catch (err) {
      console.error(err);
      message.error("Failed to upload image!");
      onError?.(err);
    } finally {
      setUploading(false);
    }
  };

  // 🔹 O‘chirish
  const handleDelete = async (id: number) => {
    try {
      await remove.mutateAsync(id);
      message.success("Image deleted!");
    } catch (err) {
      console.error(err);
      message.error("Failed to delete image!");
    }
  };

  // 🔹 Copy qilish (URL)
  const handleCopy = async (id: number, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id); // 🔸 Copy belgisini chiqarish
      setTimeout(() => setCopiedId(null), 2000); // 2 soniyadan keyin yo‘qoladi
    } catch (err) {
      console.error(err);
      message.error("Failed to copy!");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Image Uploads</Title>
        <div className="flex gap-2">
          <Upload
            showUploadList={false}
            customRequest={handleUpload}
          >
            <Button
              type="primary"
              icon={<UploadOutlined />}
              loading={uploading || create.isPending}
            >
              Upload Image
            </Button>
          </Upload>

          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <Spin size="large" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center text-gray-500">No images found.</div>
      ) : (
        <Row gutter={[16, 16]}>
          {images.map((img) => (
            <Col xs={24} sm={12} md={8} lg={6} key={img.id}>
              <Card
                hoverable
                cover={
                  <div className="relative">
                    <img
                      alt={`image-${img.id}`}
                      src={img.image}
                      className="h-48 w-full object-cover rounded"
                    />

                    {/* 🔹 Copied badge */}
                    {copiedId === img.id && (
                      <div className="absolute left-2 right-2 bg-white/80 text-green-600 px-2 py-1 rounded-md text-xs flex items-center gap-1 shadow">
                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                        Copied!
                      </div>
                    )}
                  </div>
                }
                actions={[
                  // Copy button
                  <Tooltip title="Copy URL" key="copy">
                    <CopyOutlined
                      onClick={() => handleCopy(img.id, img.image)}
                      style={{ color: "#1890ff" }}
                    />
                  </Tooltip>,

                  // Delete button
                  <Popconfirm
                    title="Delete this image?"
                    onConfirm={() => handleDelete(img.id)}
                    okText="Yes"
                    cancelText="No"
                    key="delete"
                  >
                    <DeleteOutlined style={{ color: "red" }} />
                  </Popconfirm>,
                ]}
              >
                <Meta
                  description={
                    <a
                      href={img.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-blue-600"
                    >
                      {img.image}
                    </a>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Uploads;
