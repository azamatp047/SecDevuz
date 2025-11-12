// src/components/applications-components/ApplicationDetail.tsx
import { useParams, Link } from "react-router-dom";
import { Card, Spin, Descriptions, Button, message } from "antd";
import { DownloadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getApplicationById } from "../../services/application";

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: application, isLoading, isError } = useQuery({
    queryKey: ["application", id],
    queryFn: () => getApplicationById(id!),
  });

  if (isLoading) return <Spin size="large" className="flex justify-center mt-10" />;
  if (isError || !application) return <p className="text-center text-red-500 mt-10">Application not found.</p>;

  const handleDownload = () => {
    try {
      window.open(application.resume, "_blank");
    } catch {
      message.error("Failed to open resume file");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4">
      <Card
        title={
          <div className="flex items-center justify-between">
            <span>Application Details</span>
            <Link to="/applications/admin">
              <Button icon={<ArrowLeftOutlined />}>Back to list</Button>
            </Link>
          </div>
        }
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Full Name">{application.name}</Descriptions.Item>
          <Descriptions.Item label="Email">
            <a href={`mailto:${application.email}`}>{application.email}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            <a href={`tel:${application.phone}`}>{application.phone}</a>
          </Descriptions.Item>

          <Descriptions.Item label="Vacancy Title">
            {application.vacancy?.title || "—"}
          </Descriptions.Item>

          <Descriptions.Item label="Vacancy ID">
            <Link to={`/vacancies/admin/${application.vacancy?.id}`}>
              {application.vacancy?.id}
            </Link>
          </Descriptions.Item>

          <Descriptions.Item label="Resume">
            {application.resume ? (
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
              >
                View / Download Resume
              </Button>
            ) : (
              "No file uploaded"
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ApplicationDetail;
