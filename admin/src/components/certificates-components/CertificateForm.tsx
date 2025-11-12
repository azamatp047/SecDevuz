import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Upload, message, Typography, DatePicker, Spin } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useCertificate, useCertificateMutations } from "../../hooks/useCertificate";
import dayjs from "dayjs";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

interface CertificateFormProps {
  certificateId?: string;
}

interface CertificateFormValues {
  name: string;
  issued_date: dayjs.Dayjs;
  valid_until?: dayjs.Dayjs;
  summary?: string;
  image?: {
    originFileObj: File;
  }[];
}

const CertificateForm = ({ certificateId }: CertificateFormProps) => {
  const navigate = useNavigate();
  const [form] = Form.useForm<CertificateFormValues>();
  const { data: certificate, isLoading: isCertificateLoading, isError: isCertificateError, error: certificateError } =
    useCertificate(certificateId || "");
  const { create, update } = useCertificateMutations();

  const isMutating =
    Boolean((create as any)?.isPending ?? (create as any)?.isLoading ?? (create as any)?.isMutating) ||
    Boolean((update as any)?.isPending ?? (update as any)?.isLoading ?? (update as any)?.isMutating);

  const isEditMode = !!certificateId;

  useEffect(() => {
    if (isEditMode && certificate) {
      form.setFieldsValue({
        name: certificate.name,
        issued_date: dayjs(certificate.issued_date) as any,
        valid_until: certificate.valid_until ? (dayjs(certificate.valid_until) as any) : undefined,
        summary: certificate.summary,
      });
    } else if (!isEditMode) {
      form.resetFields();
    }
  }, [isEditMode, certificate, form]);

  const onFinish = async (values: CertificateFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("issued_date", dayjs(values.issued_date).format("YYYY-MM-DD"));

      if (values.valid_until) {
        formData.append("valid_until", dayjs(values.valid_until).format("YYYY-MM-DD"));
      } else {
        formData.append("valid_until", "");
      }

      formData.append("summary", values.summary || "");

      // ✅ Upload dan kelgan faylni to‘g‘ri olish
      if (values.image && values.image[0]?.originFileObj instanceof File) {
        formData.append("image", values.image[0].originFileObj);
      }

      if (isEditMode && certificateId) {
        await (update as any).mutateAsync({ id: certificateId, data: formData });
        message.success("Certificate updated successfully!");
      } else {
        await (create as any).mutateAsync(formData);
        message.success("Certificate created successfully!");
      }

      navigate("/team/admin");
    } catch (error) {
      message.error(`Failed to ${isEditMode ? "update" : "create"} certificate.`);
      console.error(`${isEditMode ? "Update" : "Create"} Certificate Error:`, error);
    }
  };

  if (isEditMode && isCertificateLoading) {
    return (
      <Spin
        size="large"
        tip="Loading certificate data..."
        className="flex justify-center items-center h-screen"
      />
    );
  }

  if (isEditMode && isCertificateError) {
    return (
      <div className="p-6 text-center text-red-600">
        <Title level={3}>Error loading certificate for edit</Title>
        <Paragraph>{(certificateError as Error).message}</Paragraph>
        <Button type="primary" onClick={() => navigate("/team/admin/certificates")}>
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
      </div>

      <Title level={2}>
        {isEditMode ? `Edit Certificate: ${certificate?.name}` : "Create New Certificate"}
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={
          isEditMode
            ? undefined
            : {
                name: "",
                issued_date: undefined,
                valid_until: undefined,
                summary: "",
              }
        }
        className="mt-4"
      >
        <Form.Item
          name="name"
          label="Certificate Name"
          rules={[{ required: true, message: "Please enter certificate name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="issued_date"
          label="Issued Date"
          rules={[{ required: true, message: "Please select issued date!" }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="valid_until" label="Valid Until Date (optional)">
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="summary" label="Summary (optional)">
          <TextArea rows={4} />
        </Form.Item>

        {isEditMode && certificate?.image && (
          <Form.Item label="Current Image">
            <img
              src={certificate.image}
              alt={certificate.name}
              style={{ width: 100, borderRadius: 8 }}
            />
          </Form.Item>
        )}

        <Form.Item
          label={isEditMode ? "Upload New Image (optional)" : "Image (optional)"}
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload name="image" listType="picture" beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isMutating}>
            {isEditMode ? "Update Certificate" : "Create Certificate"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CertificateForm;
