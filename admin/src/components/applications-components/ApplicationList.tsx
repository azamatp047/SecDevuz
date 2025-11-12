import { useState } from "react";
import { Table, Button, Input, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useApplications, useApplicationMutations } from "../../hooks/useApplication";

const ApplicationList = () => {
  const { data: applicationsResponse, isLoading } = useApplications();
  const { remove } = useApplicationMutations();
  const [search, setSearch] = useState("");

  const applications = applicationsResponse?.results || [];

  const filteredApplications = applications.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase()) ||
    app.email.toLowerCase().includes(search.toLowerCase()) ||
    app.phone.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    try {
      await remove.mutateAsync(id.toString());
    } catch (error) {
      console.error("Failed to delete application:", error);
    }
  };

  const columns = [
    {
      title: "#",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => <a href={`mailto:${text}`}>{text}</a>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => <a href={`tel:${text}`}>{text}</a>,
    },
    {
      title: "Vakansiyaga link",
      key: "vacancyLink",
      render: (record: any) => (
        <Tooltip title="View Vacancy Details">
          <Link to={`/vacancies/admin/${record.vacancy?.id}`}>{record.vacancy.title}</Link>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <div className="flex gap-2">
          <Link to={`/applications/admin/${record.id}`}>
            <Button icon={<EyeOutlined />} />
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
          placeholder="Search applications (name, email, phone)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="w-full max-w-md"
        />
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredApplications}
        loading={isLoading}
      />
    </>
  );
};

export default ApplicationList;
