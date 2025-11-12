// src/pages/TeamMemberDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useTeamMember } from "../../hooks/useTeam";
import { Button, Spin, Typography, Image } from "antd";
import { ArrowLeftOutlined, EditOutlined, LinkedinOutlined, WechatWorkOutlined  } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const TeamMemberDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: member, isLoading, isError, error } = useTeamMember(id || "");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading Team Member..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        <Title level={3}>Error loading team member</Title>
        <Paragraph>{(error as Error).message}</Paragraph>
        <Button type="primary" onClick={() => navigate("/team/admin")}>
          Go Back to List
        </Button>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="p-6 text-center">
        <Title level={3}>Team Member not found</Title>
        <Button type="primary" onClick={() => navigate("/team/admin")}>
          Go Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => navigate("/team/admin")} icon={<ArrowLeftOutlined />}>
          Back to Team Members
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate(`/team/admin/${member.id}/edit`)}
        >
          Edit Member
        </Button>
      </div>

      <Title level={2} className="mb-4">{member.full_name}</Title>

      <div className="flex flex-wrap gap-6 mb-6">
        {member.image && (
          <div className="flex-shrink-0">
            <Image
              src={member.image}
              alt={member.full_name}
              className="w-48 h-48 object-cover rounded-lg shadow-sm"
            />
          </div>
        )}
        <div className="flex-grow">
          <Paragraph><strong>Email:</strong> {member.email}</Paragraph>
          <Paragraph><strong>Role (UZ):</strong> {member.role_uz}</Paragraph>
          <Paragraph><strong>Role (RU):</strong> {member.role_ru}</Paragraph>
          <Paragraph><strong>Role (EN):</strong> {member.role_en}</Paragraph>
          {member.linked_in_link && (
            <Paragraph>
              <strong>LinkedIn:</strong>{" "}
              <a href={member.linked_in_link} target="_blank" rel="noopener noreferrer">
                <Button type="link" icon={<LinkedinOutlined />}>Profile</Button>
              </a>
            </Paragraph>
          )}
          {member.telegram_username && (
            <Paragraph>
              <strong>Telegram:</strong>{" "}
              <a href={`https://t.me/${member.telegram_username}`} target="_blank" rel="noopener noreferrer">
                <Button type="link" icon={<WechatWorkOutlined  />}>@{member.telegram_username}</Button>
              </a>
            </Paragraph>
          )}
          {member.created_at && (
            <Paragraph type="secondary">Joined: {new Date(member.created_at).toLocaleDateString()}</Paragraph>
          )}
        </div>
      </div>

      <div className="mb-6">
        <Title level={4}>Description (UZ):</Title>
        <div dangerouslySetInnerHTML={{ __html: member.description_uz }} className="prose max-w-none" />

        <Title level={4} className="mt-4">Description (RU):</Title>
        <div dangerouslySetInnerHTML={{ __html: member.description_ru }} className="prose max-w-none" />

        <Title level={4} className="mt-4">Description (EN):</Title>
        <div dangerouslySetInnerHTML={{ __html: member.description_en }} className="prose max-w-none" />
      </div>
    </div>
  );
};

export default TeamMemberDetail;