// src/components/certificates-components/CertificatesList.tsx
import { useState } from "react";
import { Table, Button, Input, Popconfirm } from "antd";
import { DeleteOutlined, EyeOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useCertificates, useCertificateMutations } from "../../hooks/useCertificate";

const CertificatesList = () => {
  const { data: certificatesResponse, isLoading } = useCertificates();
  const { remove } = useCertificateMutations();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const certificates = certificatesResponse?.results || [];

  const filteredCertificates = certificates.filter((cert) =>
    cert.name.toLowerCase().includes(search.toLowerCase()) ||
    (cert.summary ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    try {
      await remove.mutateAsync(id.toString());
    } catch (error) {
      console.error("Failed to delete certificate:", error);
    }
  };

  const columns = [
    {
      title: "#",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Issued Date",
      dataIndex: "issued_date",
      key: "issued_date",
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Valid Until",
      dataIndex: "valid_until",
      key: "valid_until",
      render: (text?: string) => (text ? new Date(text).toLocaleDateString() : "N/A"),
    },
    {
      title: "Summary",
      dataIndex: "summary",
      key: "summary",
      render: (text?: string) => text ? (text.length > 50 ? text.substring(0, 50) + "..." : text) : "N/A",
    },
    {
      title: "Actions",
      render: (record: any) => (
        <div className="flex gap-2">
          <Link to={`/team/admin/certificates/${record.id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
          <Link to={`/team/admin/certificates/${record.id}/edit`}>
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
          placeholder="Search certificates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="w-full max-w-xs"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/team/admin/certificates/create")}
        >
          Add New Certificate
        </Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={filteredCertificates} loading={isLoading} />
    </>
  );
};

export default CertificatesList;