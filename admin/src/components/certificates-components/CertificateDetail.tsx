// src/pages/CertificateDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useCertificate } from "../../hooks/useCertificate";
import { Button, Spin, Typography, Image } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const CertificateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: certificate, isLoading, isError, error } = useCertificate(id || "");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading Certificate..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        <Title level={3}>Error loading certificate</Title>
        <Paragraph>{(error as Error).message}</Paragraph>
        <Button type="primary" onClick={() => navigate("/team/admin")}>
          Go Back to List
        </Button>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="p-6 text-center">
        <Title level={3}>Certificate not found</Title>
        <Button type="primary" onClick={() => navigate("/team/admin")}>
          Go Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => navigate("/team/admin/certificates")} icon={<ArrowLeftOutlined />}>
          Back to Certificates
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate(`/team/admin/certificates/${certificate.id}/edit`)}
        >
          Edit Certificate
        </Button>
      </div>

      <Title level={2} className="mb-4">{certificate.name}</Title>
      {certificate.image && (
        <div className="mb-6">
          <Image
            src={certificate.image}
            alt={certificate.name}
            className="max-h-96 object-contain rounded-lg shadow-sm"
          />
        </div>
      )}
      <div className="mb-6">
        <Paragraph><strong>Issued Date:</strong> {new Date(certificate.issued_date).toLocaleDateString()}</Paragraph>
        {certificate.valid_until && (
          <Paragraph><strong>Valid Until:</strong> {new Date(certificate.valid_until).toLocaleDateString()}</Paragraph>
        )}
        {certificate.summary && (
          <Paragraph><strong>Summary:</strong> {certificate.summary}</Paragraph>
        )}
      </div>
    </div>
  );
};

export default CertificateDetail;