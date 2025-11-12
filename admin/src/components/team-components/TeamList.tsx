
import { useState } from "react";
import { Table, Button, Input, Popconfirm, Avatar } from "antd";
import { DeleteOutlined, EyeOutlined, EditOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useTeamMembers, useTeamMemberMutations } from "../../hooks/useTeam";

const TeamList = () => {
  const { data: teamMembersResponse, isLoading } = useTeamMembers();
  const { remove } = useTeamMemberMutations();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const teamMembers = teamMembersResponse?.results || [];

  const filteredMembers = teamMembers.filter((member) =>
    member.full_name.toLowerCase().includes(search.toLowerCase()) ||
    member.role_uz.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    try {
      await remove.mutateAsync(id.toString());
    } catch (error) {
      console.error("Failed to delete team member:", error);
    }
  };

  const columns = [
    {
      title: "#",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (image ? <Avatar src={image} /> : <Avatar icon={<UserOutlined />} />),
    },
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Role (UZ)",
      dataIndex: "role_uz",
      key: "role_uz",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Actions",
      render: (record: any) => (
        <div className="flex gap-2">
          <Link to={`/team/admin/${record.id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
          <Link to={`/team/admin/${record.id}/edit`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Input.Search
          placeholder="Search team members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="w-full max-w-xs"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/team/admin/create")}
        >
          Add New Member
        </Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={filteredMembers} loading={isLoading} />
    </>
  );
};

export default TeamList;